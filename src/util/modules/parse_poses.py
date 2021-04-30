import numpy as np

from modules.pose import Pose, propagate_ids
try:
    from pose_extractor import extract_poses
except:
    print('#### Cannot load fast pose extraction, switched to legacy slow implementation. ####')
    from modules.legacy_pose_extractor import extract_poses

AVG_PERSON_HEIGHT = 180

# pelvis (body center) is missing, id == 2
map_id_to_panoptic = [1, 0, 9, 10, 11, 3, 4, 5, 12, 13, 14, 6, 7, 8, 15, 16, 17, 18]

limbs = [[18, 17, 1],
         [16, 15, 1],
         [5, 4, 3],
         [8, 7, 6],
         [11, 10, 9],
         [14, 13, 12]]


def get_root_relative_poses(inference_results):
    features, heatmap, paf_map = inference_results

    # paf = part affinity field

    # shape (n, height, width)
    # paf_map (38, 32, 56)
    # features (57, 32, 56)
    # heatmap (19, 32, 56)

    # 3개 (x,y, confidence(신뢰도)) * 18 = 54 , (x,y,confidence)

    # print("features", features.shape)
    # print("heatmap", heatmap.shape)
    # print("paf_map", paf_map.shape)
    upsample_ratio = 4


    # extract_poses : heatmap에서 나온 관절의 키포인트를 paf_map을 통해 그룹으로 묶음. 그 결과 사람과 그 사람의 관절 인덱스가 나옴  
    found_poses = extract_poses(heatmap[0:-1], paf_map, upsample_ratio)[0]

    # found_poses : numpy.ndarray,
    # shape (n,55) : n은 사람의 수, 55 중 54는 각 사람의 키포인트(x,y,신뢰도), 그리고 마지막 인덱스는 발견된 사람의 신뢰도
    # print(found_poses.shape)

    # scale coordinates to features space
    # 0 부터 -1(마지막)까지 3 간격씩 끊어서 업셈플링
    # 0은 x , 1은 y
    found_poses[:, 0:-1:3] /= upsample_ratio
    found_poses[:, 1:-1:3] /= upsample_ratio
    # print(found_poses)

    poses_2d = []
    # panoptic : 모든 것이 한 눈에 보이는, 파노라마적인. 모든 요소를 포함하는, 총괄적인, 모든 부분이 한 눈에 보이는
    num_kpt_panoptic = 19
    num_kpt = 18


    # 발견된 포즈에서 신뢰도가 -1인 부분은 제외하고, 키포인트의 인덱스 순서를 재정립함.
    # pose_id 식별된 사람의 인덱스
    for pose_id in range(found_poses.shape[0]):
        
        # 신뢰도가 -1 이면 넘어감.
        if found_poses[pose_id, 3] == -1:  # skip pose if does not found neck
            continue
        pose_2d = np.ones(num_kpt_panoptic * 3 + 1, dtype=np.float32) * -1  # +1 for pose confidence
        for kpt_id in range(num_kpt):

            # 신뢰도가 -1이 아니라면 
            if found_poses[pose_id, kpt_id * 3] != -1:

                # found_poses[pose_id, kpt_id * 3:kpt_id * 3 + 2]의 shape = (2,)
                # 각각 x_2d, y_2d
                x_2d, y_2d = found_poses[pose_id, kpt_id * 3:kpt_id * 3 + 2]

                # confidence : 신뢰도
                confidence = found_poses[pose_id, kpt_id * 3 + 2]

                # 원소의 위치 재 정립
                # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
                # [1, 0, 9, 10, 11, 3, 4, 5, 12, 13, 14, 6, 7, 8, 15, 16, 17, 18]
                pose_2d[map_id_to_panoptic[kpt_id] * 3] = x_2d  
                pose_2d[map_id_to_panoptic[kpt_id] * 3 + 1] = y_2d
                pose_2d[map_id_to_panoptic[kpt_id] * 3 + 2] = confidence
        pose_2d[-1] = found_poses[pose_id, -1]

        # print(pose_2d)
        poses_2d.append(pose_2d)


    keypoint_treshold = 0.1
    # num_kpt_panoptic * 4 : (x,y,z,신뢰도)
    poses_3d = np.ones((len(poses_2d), num_kpt_panoptic * 4), dtype=np.float32) * -1
    for pose_id in range(len(poses_3d)):

        # 임계값 0.1 보다 신뢰도가 높은지 확인
        if poses_2d[pose_id][2] > keypoint_treshold:
            neck_2d = poses_2d[pose_id][:2].astype(int)

            # 목 위치에서 모든 포즈 좌표를 확인.
            # read all pose coordinates at neck location
            for kpt_id in range(num_kpt_panoptic):
                map_3d = features[kpt_id * 3:(kpt_id + 1) * 3]
                poses_3d[pose_id][kpt_id * 4] = map_3d[0, neck_2d[1], neck_2d[0]] * AVG_PERSON_HEIGHT
                poses_3d[pose_id][kpt_id * 4 + 1] = map_3d[1, neck_2d[1], neck_2d[0]] * AVG_PERSON_HEIGHT
                poses_3d[pose_id][kpt_id * 4 + 2] = map_3d[2, neck_2d[1], neck_2d[0]] * AVG_PERSON_HEIGHT
                poses_3d[pose_id][kpt_id * 4 + 3] = poses_2d[pose_id][kpt_id * 3 + 2]

            # 해당 팔다리 위치에서 키포인트 좌표 조정
            # refine keypoints coordinates at corresponding limbs locations
            for limb in limbs:
                for kpt_id_from in limb:
                    if poses_2d[pose_id][kpt_id_from * 3 + 2] > keypoint_treshold:
                        for kpt_id_where in limb:
                            kpt_from_2d = poses_2d[pose_id][kpt_id_from*3: kpt_id_from*3 + 2].astype(int)
                            map_3d = features[kpt_id_where * 3:(kpt_id_where + 1) * 3]
                            poses_3d[pose_id][kpt_id_where * 4] = map_3d[0, kpt_from_2d[1], kpt_from_2d[0]] * AVG_PERSON_HEIGHT
                            poses_3d[pose_id][kpt_id_where * 4 + 1] = map_3d[1, kpt_from_2d[1], kpt_from_2d[0]] * AVG_PERSON_HEIGHT
                            poses_3d[pose_id][kpt_id_where * 4 + 2] = map_3d[2, kpt_from_2d[1], kpt_from_2d[0]] * AVG_PERSON_HEIGHT
                        break

    return poses_3d, np.array(poses_2d), features.shape


previous_poses_2d = []


# parse_poses
# input
# - inference_results
# - input_scale
# - stride
# - fx
# - is_video=False
def parse_poses(inference_results, input_scale, stride, fx, is_video=False):
    global previous_poses_2d
    poses_3d, poses_2d, features_shape = get_root_relative_poses(inference_results)
    poses_2d_scaled = []
    for pose_2d in poses_2d:
        num_kpt = (pose_2d.shape[0] - 1) // 3
        pose_2d_scaled = np.ones(pose_2d.shape[0], dtype=np.float32) * -1  # +1 for pose confidence
        for kpt_id in range(num_kpt):
            if pose_2d[kpt_id * 3] != -1:
                pose_2d_scaled[kpt_id * 3] = int(pose_2d[kpt_id * 3] * stride / input_scale)
                pose_2d_scaled[kpt_id * 3 + 1] = int(pose_2d[kpt_id * 3 + 1] * stride / input_scale)
                pose_2d_scaled[kpt_id * 3 + 2] = pose_2d[kpt_id * 3 + 2]
        pose_2d_scaled[-1] = pose_2d[-1]
        poses_2d_scaled.append(pose_2d_scaled)

    if is_video:  # track poses ids
        current_poses_2d = []
        for pose_id in range(len(poses_2d_scaled)):
            pose_keypoints = np.ones((Pose.num_kpts, 2), dtype=np.int32) * -1
            for kpt_id in range(Pose.num_kpts):
                if poses_2d_scaled[pose_id][kpt_id * 3] != -1.0:  # keypoint was found
                    pose_keypoints[kpt_id, 0] = int(poses_2d_scaled[pose_id][kpt_id * 3 + 0])
                    pose_keypoints[kpt_id, 1] = int(poses_2d_scaled[pose_id][kpt_id * 3 + 1])
            pose = Pose(pose_keypoints, poses_2d_scaled[pose_id][-1])
            current_poses_2d.append(pose)

        # ?? 정확히 무슨 역할인지 모르겟음. 논문의 검토가 필요함.
        propagate_ids(previous_poses_2d, current_poses_2d)
        previous_poses_2d = current_poses_2d

    translated_poses_3d = []
    # translate poses
    for pose_id in range(len(poses_3d)):
        # shape
        # reshape :  (19, 4)
        # transpose :  (4, 19)
        # print("reshape : ",poses_3d[pose_id].reshape((-1, 4)).shape)
        # print("transpose : ",poses_3d[pose_id].reshape((-1, 4)).transpose().shape)

        pose_3d = poses_3d[pose_id].reshape((-1, 4)).transpose()
        pose_2d = poses_2d[pose_id][:-1].reshape((-1, 3)).transpose()

        num_valid = np.count_nonzero(pose_2d[2] != -1)
        pose_3d_valid = np.zeros((3, num_valid), dtype=np.float32)
        pose_2d_valid = np.zeros((2, num_valid), dtype=np.float32)
        valid_id = 0
        for kpt_id in range(pose_3d.shape[1]):

            # 신뢰도가 -1이면 다음으로 넘어감
            if pose_2d[2, kpt_id] == -1:
                continue
            
            pose_3d_valid[:, valid_id] = pose_3d[0:3, kpt_id]
            pose_2d_valid[:, valid_id] = pose_2d[0:2, kpt_id]
            valid_id += 1

        print(pose_2d_valid)

        pose_2d_valid[0] = pose_2d_valid[0] - features_shape[2]/2
        pose_2d_valid[1] = pose_2d_valid[1] - features_shape[1]/2
        mean_3d = np.expand_dims(pose_3d_valid.mean(axis=1), axis=1)
        mean_2d = np.expand_dims(pose_2d_valid.mean(axis=1), axis=1)
        numerator = np.trace(np.dot((pose_3d_valid[:2, :] - mean_3d[:2, :]).transpose(),
                                    pose_3d_valid[:2, :] - mean_3d[:2, :])).sum()
        numerator = np.sqrt(numerator)
        denominator = np.sqrt(np.trace(np.dot((pose_2d_valid[:2, :] - mean_2d[:2, :]).transpose(),
                                              pose_2d_valid[:2, :] - mean_2d[:2, :])).sum())
        mean_2d = np.array([mean_2d[0, 0], mean_2d[1, 0], fx * input_scale / stride])
        mean_3d = np.array([mean_3d[0, 0], mean_3d[1, 0], 0])
        translation = numerator / denominator * mean_2d - mean_3d

        if is_video:
            translation = current_poses_2d[pose_id].filter(translation)

        for kpt_id in range(19):
            pose_3d[0, kpt_id] = pose_3d[0, kpt_id] + translation[0]
            pose_3d[1, kpt_id] = pose_3d[1, kpt_id] + translation[1]
            pose_3d[2, kpt_id] = pose_3d[2, kpt_id] + translation[2]
            
        translated_poses_3d.append(pose_3d.transpose().reshape(-1))

    return np.array(translated_poses_3d), np.array(poses_2d_scaled)
