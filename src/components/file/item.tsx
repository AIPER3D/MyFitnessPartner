import React, {useState} from 'react';
import styled from 'styled-components';

import { RxDatabase } from 'rxdb';
import { VideoDTO } from '../../db/DTO';
import { VideoDAO } from '../../db/DAO';

import { Data } from './data';
import progress from './images/progress.gif';
import progress16 from './images/progress16.gif';
import check16 from './images/check16.png';

type ItemProps = {
	db: RxDatabase;
    data: Data;
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

function Item({ db, data } : ItemProps) {
	const videoDTO = new VideoDTO();
	const [thumb, setThumb] = useState<string>(progress);
	const [current, setCurrent] = useState<number>(0);
	const [total, setTotal] = useState<number>(0);
	const [status, setStatus] = useState<number>(0);

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
				setThumb(image);
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
			.catch(() => {
				console.error('썸네일 생성 오류');
			});
	};
	data.reader.onprogress = (e) => {
		if (e.lengthComputable) {
			setCurrent(e.loaded);
			setTotal(e.total);
			setStatus(1);
		}
	};

	// 운동 영상 분석
	function analysis(video : Blob, thumbnail : string) {
		setStatus(2);

		setTimeout(() => {
			submit(video, thumbnail).then(() => { });
		}, 3000);
	}

	// 운동 영상 등록
	async function submit(video : Blob, thumbnail : string) {
		setStatus(3);

		const videoDAO : VideoDAO = {
			videoId: await videoDTO.getCount() + 1,
			videoName: data.file.name,
			thumbnail: thumbnail,
		};

		const result = await videoDTO.addVideo(videoDAO);
		console.log(result);

		setStatus(4);
	}

	if (status == 1) {
		return (
			<Root>
				<div></div>
				<Thumbnail src={ thumb }/>
				<Title> { data.file.name } </Title>
				<Line>
					<Image src={ progress16 } />
					<Text>업로드 중 ({ Math.round(100 * current / total).toFixed(0) }%)</Text>
				</Line>
			</Root>
		);
	} else if (status == 2) {
		return (
			<Root>
				<div></div>
				<Thumbnail src={ thumb }/>
				<Title> { data.file.name } </Title>
				<Line>
					<Image src={ check16 } />
					<Text>업로드 완료</Text>
				</Line>
				<Line>
					<Image src={ progress16 } />
					<Text>분석 중</Text>
				</Line>
			</Root>
		);
	} else if (status == 3) {
		return (
			<Root>
				<div></div>
				<Thumbnail src={ thumb }/>
				<Title> { data.file.name } </Title>
				<Line>
					<Image src={ check16 } />
					<Text>업로드 완료</Text>
				</Line>
				<Line>
					<Image src={ check16 } />
					<Text>분석 완료</Text>
				</Line>
				<Line>
					<Image src={ progress16 } />
					<Text>등록 중</Text>
				</Line>
			</Root>
		);
	} else if (status == 4) {
		return (
			<Root>
				<div></div>
				<Thumbnail src={ thumb }/>
				<Title> { data.file.name } </Title>
				<Line>
					<Image src={ check16 } />
					<Text>업로드 완료</Text>
				</Line>
				<Line>
					<Image src={ check16 } />
					<Text>분석 완료</Text>
				</Line>
				<Line>
					<Image src={ check16 } />
					<Text>등록 완료</Text>
				</Line>
			</Root>
		);
	} else {
		return (
			<Root>
				<div></div>
				<Thumbnail src={ thumb }/>
				<Title> { data.file.name } </Title>
			</Root>
		);
	}
}

Item.defaultProps = {

};

export default Item;
