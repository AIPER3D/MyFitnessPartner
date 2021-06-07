import { RxDatabase } from 'rxdb';
import React, {useEffect, useState} from 'react';
import './dashboard.scss';
import Chart from './Chart';
import DoughnutChart from './DoughnutChart';
import { RecordDTO } from '../../db/DTO/recordDTO';
import { UserDTO } from '../../db/DTO/userDTO';
import { UserDAO } from '../../db/DAO/userDAO';
import { RecordDAO } from '../../db/DAO';
import moment from 'moment';
type DashBoardProps = {
	db : RxDatabase;
}
function Dashboard({db}: DashBoardProps) {
	const [recordDTO, setRecordDTO] = useState<RecordDTO>(new RecordDTO());
	const [records, setRecords] = useState<RecordDAO[] | null>(null);
	const userDTO = new UserDTO();
	const [elist, setElist] = useState<any>(null);
	const [user, setUser] = useState<UserDAO | null>(null);
	const [time, setTime] = useState(1);
	const [day, setDay] = useState(0);
	useEffect(()=>{
		recordDTO.setDB(db);
		userDTO.setDB(db);
		getUser();
		getRecord();
		(async ()=>{
			setTime(await getExerciseTime());
			setDay(await yourExerciseDay());
			setElist(await yourExerciseRecord());
		})();
	}, [db]);

	async function getUser() {
		setUser(await userDTO.getUser());
	}

	async function getRecord() {
		setRecords(await recordDTO.getAllRecords());
	}
	function yourCalory() {
		let kcal;
		if (user) {
			if (user.gender === 'M') {
				kcal = (66.47 + (13.75 * user.weight) + (5* user.height) - (6.76 * user.age)).toFixed(1);
				if (Number(kcal) > 1557 && Number(kcal) < 1558) {
					return '국노야...';
				} else {
					return kcal;
				}
			} else if (user.gender === 'F') {
				kcal = (655 + (9.6 * user.weight) + (1.8* user.height) - (4.7 * user.age)).toFixed(1);
				if (Number(kcal) > 1557 && Number(kcal) < 1558) {
					return '국노야...';
				} else {
					return kcal;
				}
			}
		}
	}

	async function getExerciseTime() {
		return await recordDTO.getTimeByDay(Number(moment().format('YYYYMMDD')));
	}

	async function yourExerciseDay() {
		return await recordDTO.getExerciseDay();
	}

	async function yourExerciseRecord() {
		return await recordDTO.getExerciseRecord();
	}

	function mostExercise() {
		const cards = [];
		if (elist) {
			const list = Object.keys(elist);
			for (let i =1; i < 4; i++) {
				cards.push(
					<div className={`card${i}`} key={i}>
						<h1>{list[i-1]}</h1>
						<p>{elist[list[i-1]]} 회</p>
					</div>
				);
			}
		}
		return cards;
	}


	function generateLegend() {
		const legend = [];
		if (elist) {
			const total = elist.Squat + elist.Jump + elist.Lunge;
			if (total !== 0) {
				const persent = [(elist.Squat/total*100).toFixed(1),
					(elist.Jump/total*100).toFixed(1), (elist.Lunge/total*100).toFixed(1)];
				const list = Object.keys(elist);
				for (let i =1; i < persent.length+1; i++) {
					legend.push(
						<div className={`legend${i}`} key={i}>
							<span className="legend_color"> </span>
							<span>{list[i-1]} : {persent[i-1]}%</span>
						</div>
					);
				}
			}
		}
		return legend;
	}

	return (
		<main>
			<div className="main_container">
				<div className="main_title">
					<div className="main_greeting">
						<h1> DASHBOARD </h1>
						<p> 현재 운동 정보를 보여줍니다.</p>
					</div>
				</div>
				<div className="main_card">
					<div className="card">
						<i className="fas fa-fire-alt fa-2x text-sunset"></i>
						<div className="card_inner">
							<p className="text-primary-p"> 기초 <br /> 대사량 </p>
							<span className="font-bold text-title"> {yourCalory()} Kcal</span>
						</div>
					</div>
					<div className="card">
						<i className="far fa-clock fa-2x text-dark"></i>
						<div className="card_inner">
							<p className="text-primary-p"> 오늘 운동시간 </p>
							<span className="font-bold text-title"> {time.toFixed(0)} 분</span>
						</div>
					</div>
					<div className="card">
						<i className="fa fa-calendar fa-2x text-red"></i>
						<div className="card_inner">
							<p className="text-primary-p"> 총 운동 날짜 </p>
							<span className="font-bold text-title"> {day} 일</span>
						</div>
					</div>
				</div>
				<div className="charts">
					<div className="charts_exerciseAmount">
						<div className="charts_exerciseAmount_title">
							<div>
								<h1>주간 운동량</h1>
							</div>
						</div>
						<Chart db={db}/>
					</div>
					<div className="charts_exerciseInfo">
						<div className="charts_exerciseInfo_title">
							<div>
								<h1>운동 정보 일람</h1>
							</div>
						</div>
						<div className="charts_exerciseInfo_cards">
							{ mostExercise() }
						</div>
					</div>
					<div className="charts_exerciseDoughnut">
						<div className="charts_exerciseDoughnut_title">
							<div>
								<h1>운동 점유율</h1>
							</div>
							<div className="charts_exerciseDoughnut_legend">
								{generateLegend()}
							</div>
						</div>
						<DoughnutChart list={elist}/>
					</div>
				</div>
			</div>
		</main>
	);
}


export default Dashboard;
