const fs = window.require('fs');
const tf = require('@tensorflow/tfjs');
const { ipcRenderer } = window.require('electron');

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { RxDatabase } from 'rxdb';
import { VideoDTO } from '../../db/DTO';
import { VideoDAO } from '../../db/DAO';

import { Data } from './data';
import progress from './images/progress.gif';
import progress16 from './images/progress16.gif';
import check16 from './images/check16.png';
import Status from './status';
import { getCount, getSquareBound } from '../../utils/posenet-utils';
import { timer } from '../../utils/bench-util';

type ItemProps = {
	db: RxDatabase;
    data: Data;
    onPredict: (tensorImage : any, end : boolean) => Promise<string>;
    predictable: boolean;
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


function Item({ db, data, onPredict, predictable } : ItemProps) {
	const videoDTO = new VideoDTO();
	const id = videoDTO.getNewId();
	const [thumb, setThumb] = useState<string>(progress);
	const [src, setSrc] = useState<any>(null);

	const [current, setCurrent] = useState<number>(0);
	const [total, setTotal] = useState<number>(0);
	const [analysisPer, setAnalysisPer] = useState<number>(0);
	const [analysisBefore, setAnalysisBefore] = useState<number>(0);
	const [analysisRefresh, setAnalysisRefresh] = useState<number>(0);
	const [analysisKey, setAnalysisKey] = useState<number>(0);

	const [uploadStatus, setUploadStatus] = useState<number>(0);
	const [analysisStatus, setAnalysisStatus] = useState<number>(0);
	const [submitStatus, setSubmitStatus] = useState<number>(0);

	const [videoElement] = useState<any>(document.createElement('video'));
	const [canvasElement] = useState<any>(document.createElement('canvas'));
	const ctx : any = canvasElement.getContext('2d');
	// const ccc = useRef<HTMLCanvasElement | null>(null);

	const [fileThumbnail, setFileThumbnail] = useState<any>(null);
	const [fileVideo, setFileVideo] = useState<any>(null);

	const [timelineArray] = useState<any>([]);
	const [exerciseArray] = useState<any>([]);
	const [timeArray] = useState<any>([0, 0]);

	videoDTO.setDB(db);

	useEffect(() => {
		return (() => {
			videoElement.pause();
		});
	}, []);

	useEffect(() => {
		if (uploadStatus == Status.UPLOADING_SUCCES && analysisStatus == 0 && predictable == true) {
			(async () => {
				function retryCheck() {
					setAnalysisRefresh(Math.random());
					setTimeout(retryCheck, 10000);
				}

				setAnalysisStatus(Status.ANALYZING);
				setAnalysisKey(analysisRefresh);
				await analysis(analysisRefresh);

				setTimeout(retryCheck, 10000);
			})();
		} else if (analysisStatus == Status.ANALYZING) {
			if (analysisPer < 100 && analysisBefore == analysisPer) {
				console.log('분석 재시작');
				setAnalysisStatus(Status.ANALYZING);
				(async () => {
					setAnalysisKey(analysisRefresh);
					await analysis(analysisRefresh);
				})();
			} else {
				console.log(analysisStatus + ' : ' + analysisBefore + ' > ' + analysisPer);
				setAnalysisBefore(analysisPer);
			}
		}
	}, [uploadStatus, predictable, analysisRefresh]);

	// 운동 영상 업로드
	data.reader.onload = async (e) => {
		if (e.target == null || e.target.result == null) return;
		const blob = new Blob([e.target.result], {type: data.file.type});
		const url = URL.createObjectURL(blob);

		const snapImage = async () => {
			setUploadStatus(Status.SAVING_THUMBNAIL);
			canvasElement.width = videoElement.videoWidth / 2;
			canvasElement.height = videoElement.videoHeight / 2;

			ctx.drawImage(
				videoElement,
				0,
				0,
				canvasElement.width,
				canvasElement.height
			);

			const image = canvasElement.toDataURL();
			const success = image.length > 10000;

			if (success) {
				if (e.target == null || e.target.result == null) {
					setUploadStatus(Status.UPLOADING_ERROR);
					console.log(e);
					return;
				}

				setUploadStatus(Status.SAVING_VIDEO);
				setFileThumbnail(image);
				setThumb(image);
				setFileVideo(Buffer.from(e.target.result));

				setUploadStatus(Status.UPLOADING_SUCCES);
			}
			return success;
		};
		const timeupdate = async () => {
			if (await snapImage()) {
				videoElement.removeEventListener('timeupdate', timeupdate);
			}
		};

		videoElement.addEventListener('loadeddata', async function() {
			if (await snapImage()) {
				videoElement.removeEventListener('timeupdate', timeupdate);
			}
		});
		videoElement.addEventListener('timeupdate', timeupdate);
		videoElement.preload = 'metadata';
		videoElement.src = url;
		setSrc(url);

		videoElement.muted = true;
		videoElement.playsInline = true;
		videoElement.playbackRate = 0.1;
		videoElement.play()
			.then(() => {

			})
			.catch((e : any) => {
				console.log(e);
				setUploadStatus(Status.UPLOADING_ERROR);
			});
	};
	data.reader.onprogress = async (e) => {
		if (e.lengthComputable) {
			setCurrent(e.loaded);
			setTotal(e.total);
			setUploadStatus(1);
		}
	};

	// 운동 영상 분석
	async function analysis(key : number) {
		async function getFrame(now : any, meta : any) {
			try {
				videoElement.pause();

				// 재시작하여 새로운 분석이 시작되면, 기존의 분석 프로세스는 중단
				if (key != analysisKey) {
					return;
				}

				// 1. get sqaure bounding box
				const boundingBox = getSquareBound(meta.width, meta.height);

				// 2. resize image
				const tensor = (await tf.browser.fromPixelsAsync(videoElement));
				const expandedTensor = tensor.expandDims();
				const resizedTensor = tf.image.cropAndResize(expandedTensor, [boundingBox], [0], [224, 224]);

				// 3. inference image
				const result = await onPredict(resizedTensor, false);

				tensor.dispose();
				expandedTensor.dispose();
				resizedTensor.dispose();

				// exerciseArray가 비어있는 상태
				if (exerciseArray.length <= 0) {
					// 시작시간 설정
					timeArray[0] = timeArray[1];
				}

				// 결과를 배열에 추가
				exerciseArray.push(result);

				// 가장 마지막 시간을 종료 시간으로 설정
				if (meta.mediaTime > timeArray[1]) {
					timeArray[1] = meta.mediaTime;
				}

				// exerciseArray가 가득찬 상태
				if (exerciseArray.length >= 20) {
					// 빈도 측정

					const count = getCount(exerciseArray);

					const sortedCount = Object.keys(count).sort(function(a, b) {
						return count[a] - count[b];
					});
					const maxKey = sortedCount[sortedCount.length - 1];

					// console.log({
					// 	start: timeArray[0],
					// 	end: timeArray[1],
					// 	result: count,
					// });

					// 마무리
					if (timelineArray.length > 0 && timelineArray[timelineArray.length - 1]['name'] == maxKey) {
						timelineArray[timelineArray.length - 1]['end'] = timeArray[1];
					} else {
						timelineArray.push({
							name: maxKey,
							start: timeArray[0],
							end: timeArray[1],
						});
					}

					// 비우기
					for (let i = exerciseArray.length; i > 0; i--) {
						exerciseArray.pop();
					}
				}

				// 분석 수치 입력
				setAnalysisPer(Math.round(videoElement.currentTime / videoElement.duration * 100));
				// 반복
				if (!videoElement.ended &&
					(videoElement.duration - videoElement.currentTime) > 0.5) {
					videoElement.play()
						.then(() => {
							videoElement.requestVideoFrameCallback(getFrame);
						})
						.catch(async (e: any) => {
							setTimeout(() => {
								videoElement.play()
									.then(async () => {
										console.log('재생');
										videoElement.requestVideoFrameCallback(getFrame);
									})
									.catch(async (e: any) => {
										console.log(e);
										console.log('오류로 인한 분석 재시작');
										setAnalysisStatus(Status.ANALYZING);
										setAnalysisKey(analysisRefresh);
										await analysis(analysisRefresh);
									});
							}, 1000);
						});
				} else {
					// 타임라인이 비면 뭔가 문제가 있는것이므로 재시도
					if (timelineArray.length <= 0) {
						console.log('분석 재시작');
						setAnalysisStatus(Status.ANALYZING);
						setAnalysisKey(analysisRefresh);
						await analysis(analysisRefresh);
					} else {
						await onPredict(null, true);
						setAnalysisStatus(Status.ANALYZING_SUCCES);
						console.log(timelineArray);
						await submit();
					}
				}
			} catch (e : any) {
				console.log(e);
				console.log('오류로 인한 분석 재시작');
				setAnalysisStatus(Status.ANALYZING);
				setAnalysisKey(analysisRefresh);
				await analysis(analysisRefresh);
			}
		}

		for (let i = 0; i < timelineArray.length; i++) {
			timelineArray.pop();
		}
		for (let i = 0; i < exerciseArray.length; i++) {
			exerciseArray.pop();
		}
		timeArray[0] = 0;
		timeArray[1] = 0;

		videoElement.currentTime = 0;
		videoElement.playbackRate = 0.1;
		videoElement.play().
			then(async () => {
				console.log('재생');
				videoElement.requestVideoFrameCallback(getFrame);
				videoElement.playbackRate = 16;
			}).catch(async (e : any) => {
				console.log(e);
				console.log('오류로 인한 분석 재시작');
				setAnalysisStatus(Status.ANALYZING);
				setAnalysisKey(analysisRefresh);
				await analysis(analysisRefresh);
			});
	}

	// 운동 영상 등록
	async function submit() {
		setSubmitStatus(Status.SUBMITTING);

		const thumbName = id + '.im';
		fs.writeFileSync('./files/thumbnails/' + thumbName, fileThumbnail);

		const vidName = id + '.vd';
		fs.writeFileSync('./files/videos/' + vidName, fileVideo);


		const videoDAO : VideoDAO = {
			id: id,
			name: data.file.name,
			timeline: timelineArray,
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
			<Text>분석 중 ({ analysisPer.toFixed(0) }%)</Text>
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

	// <canvas ref = { ccc } />
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
