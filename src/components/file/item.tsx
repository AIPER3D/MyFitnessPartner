const fs = window.require('fs');
import React, {useState} from 'react';
import styled from 'styled-components';

import { RxDatabase } from 'rxdb';
import { VideoDTO } from '../../db/DTO';
import { VideoDAO } from '../../db/DAO';

import { Data } from './data';
import progress from './images/progress.gif';
import progress16 from './images/progress16.gif';
import check16 from './images/check16.png';
import Status from './status';
import { FFmpeg } from '@ffmpeg/ffmpeg';

type ItemProps = {
	db: RxDatabase;
    data: Data;
	ffmpeg : FFmpeg;
};

const Root = styled.div`
	float: left;
	
	width: calc(100% - 10px);
	height: 100px;
	margin: 10px 5px 0px 5px;
	
	border: 1px solid #dddddd;
	background: #eeeeee;	
`;

const Thumbnail = styled.img`
	float: left;
	width: 150px;
	height: 100px;
	
	background-color: #000000;
	object-fit: contain;
`;

const Title = styled.div`
	float: left;
	width: calc(100% - 200px);
	height: 20px;
	padding: 20px 0px 20px 20px;
	margin: 0px 0px 0px 0px;
	
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap; 
	
	color: #000000;
	font-size: 11pt;
	font-weight: bold;
	text-align: left;
`;

const Line = styled.div`
	float: left;
	width: 200px;
	height: 16px;
	padding: 2px 0px 5px 20px;
	margin: 0px 0px 0px 0px;
	
	color: #000000;
	font-size: 10pt;
	text-align: left;
`;

const Image = styled.img`
	width: 16px;
	height: 16px;
	
	padding: 2px 0px 0px 0px;
`;

const Text = styled.p`
	display: inline;
	margin: 0px 0px 0px 5px;
	vertical-align: top;
`;


function Item({ db, data, ffmpeg } : ItemProps) {
	const videoDTO = new VideoDTO();
	const [id, setId] = useState<number>(videoDTO.getNewId());
	const [thumb, setThumb] = useState<string>(progress);

	const [current, setCurrent] = useState<number>(0);
	const [total, setTotal] = useState<number>(0);

	const [uploadStatus, setUploadStatus] = useState<number>(0);
	const [analysisStatus, setAnalysisStatus] = useState<number>(0);
	const [submitStatus, setSubmitStatus] = useState<number>(0);

	videoDTO.setDB(db);

	// 운동 영상 업로드
	data.reader.onload = (e) => {
		if (e.target == null || e.target.result == null) return;
		const blob = new Blob([e.target.result], {type: data.file.type});
		const url = URL.createObjectURL(blob);

		const video = document.createElement('video');
		const snapImage = () => {
			const canvas : HTMLCanvasElement = document.createElement('canvas');
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;

			canvas.getContext('2d')?.drawImage(
				video,
				0,
				0,
				canvas.width,
				canvas.height
			);

			const image = canvas.toDataURL();
			const success = image.length > 100000;

			if (success) {
				if (e.target == null || e.target.result == null) {
					setUploadStatus(Status.UPLOADING_ERROR);
					console.log(e);
					return;
				}

				const thumbName = id + '.im';
				fs.writeFileSync('./files/thumbnails/' + thumbName, image);
				setThumb(image);
				setUploadStatus(Status.SAVING_THUMBNAIL);

				const vidName = id + '.vd';
				const vidValue = Buffer.from(e.target.result);
				fs.writeFileSync('./files/videos/' + vidName, vidValue);
				setUploadStatus(Status.SAVING_VIDEO);
				analysis(blob, image);
			}
			return success;
		};
		const timeupdate = () => {
			if (snapImage()) {
				video.removeEventListener('timeupdate', timeupdate);
				video.pause();
			}
		};

		video.addEventListener('loadeddata', function() {
			if (snapImage()) {
				video.removeEventListener('timeupdate', timeupdate);
			}
		});
		video.addEventListener('timeupdate', timeupdate);
		video.preload = 'metadata';
		video.src = url;

		video.muted = true;
		video.playsInline = true;
		video.play()
			.then(() => {

			})
			.catch((e) => {
				console.log(e);
				setUploadStatus(Status.UPLOADING_ERROR);
			});
	};
	data.reader.onprogress = (e) => {
		if (e.lengthComputable) {
			setCurrent(e.loaded);
			setTotal(e.total);
			setUploadStatus(1);
		}
	};

	// 운동 영상 분석
	function analysis(video : Blob, thumbnail : string) {
		// 1. 영상 분석 중
		setAnalysisStatus(Status.ANALYZING);

		// 2. 영상 프레임마다 반복
		function getVideoFrame() {

		}

		// 3. 각 프레임을 입력으로 exercise classification에 추론


		// 5. 3초 뒤에 영상 등록
		setTimeout(() => {
			setAnalysisStatus(Status.ANALYZING_SUCCES);
			submit(video, thumbnail).then(() => { });
		}, 3000);
	}

	// 운동 영상 등록
	async function submit(video : Blob, thumbnail : string) {
		setSubmitStatus(Status.SUBMITTING);

		const videoDAO : VideoDAO = {
			id: id,
			name: data.file.name,
		};

		const result = await videoDTO.addVideo(videoDAO);
		if (!result) {
			setSubmitStatus(Status.SUBMITTING_FAIL);
			return;
		}
		setSubmitStatus(Status.SUBMITTING_SUCCESS);
	}

	// 출력
	const arr = [];

	// 업로드
	if (uploadStatus == Status.UPLOADING) {
		arr.push(<Line key={ 0 }>
			<Image src={ progress16 } />
			<Text>업로드 중 ({ Math.round(100 * current / total).toFixed(0) }%)</Text>
		</Line>);
	} else if (uploadStatus == Status.SAVING_THUMBNAIL) {
		arr.push(<Line key={ 0 }>
			<Image src={ progress16 } />
			<Text>썸네일 저장중</Text>
		</Line>);
	} else if (uploadStatus == Status.SAVING_VIDEO) {
		arr.push(<Line key={ 0 }>
			<Image src={ progress16 } />
			<Text>영상 저장중</Text>
		</Line>);
	} else if (uploadStatus == Status.UPLOADING_SUCCES) {
		arr.push(<Line key={ 0 }>
			<Image src={ check16 } />
			<Text>업로드 완료</Text>
		</Line>);
	} else if (uploadStatus == Status.UPLOADING_ERROR) {
		arr.push(<Line key={ 0 }>
			<Image src={ check16 } />
			<Text>업로드 오류</Text>
		</Line>);
	}

	// 분석
	if (analysisStatus == Status.ANALYZING) {
		arr.push(<Line key={ 1 }>
			<Image src={ progress16 } />
			<Text>분석 중</Text>
		</Line>);
	} else if (analysisStatus == Status.ANALYZING_SUCCES) {
		arr.push(<Line key={ 1 }>
			<Image src={ check16 } />
			<Text>분석 완료</Text>
		</Line>);
	} else if (analysisStatus == Status.ANALYZING_FAIL) {
		arr.push(<Line key={ 1 }>
			<Image src={ check16 } />
			<Text>분석 실패</Text>
		</Line>);
	}

	// 등록
	if (submitStatus == Status.SUBMITTING) {
		arr.push(<Line key={ 2 }>
			<Image src={ progress16 } />
			<Text>등록 중</Text>
		</Line>);
	} else if (submitStatus == Status.SUBMITTING_SUCCESS) {
		arr.push(<Line key={ 2 }>
			<Image src={ check16 } />
			<Text>등록 완료</Text>
		</Line>);
	} else if (submitStatus == Status.SUBMITTING_FAIL) {
		arr.push(<Line key={ 2 }>
			<Image src={ check16 } />
			<Text>등록 실패</Text>
		</Line>);
	}


	return (
		<Root>
			<Thumbnail src={ thumb }/>
			<Title> { data.file.name } </Title>
			{ arr }
		</Root>
	);
}

Item.defaultProps = {

};

export default Item;
