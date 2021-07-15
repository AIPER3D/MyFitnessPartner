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

/* 구현자: 김인환
운동 기록에 대한 정보를 사용자가 일목요연하게 확인할 수 있는 컴포넌트가 필요하다고 생각하였다.
기능만 구현한다고 해서, 사용자 친화적이지 않다면 실효성이 없기 때문임. 그래서 대시보드같은 구성의 컴포넌트가 적절하다고 생각해서 구현을 하였다.
처음의 카드들에는 사용자의 정보를 바탕으로 한 기초대사량, 오늘 운동시간, 총 운동일을 보였고
그 다음부턴 일주일 단위로 운동 정보 그래프, 운동 비율 등을 보여준다.
*/
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

	// 유저 정보를 가져온다.
	async function getUser() {
		setUser(await userDTO.getUser());
	}

	// 현재 프로그램에 저장된 모든 운동기록을 불러온다.
	async function getRecord() {
		setRecords(await recordDTO.getAllRecords());
	}


	// 유저의 키, 몸무게, 나이 정보를 바탕으로 기초대사량을 계산하는 함수이다. 추가적으로 이스터에그도 집어넣어뒀다.
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

	// 오늘 운동한 시간을 불러온다.
	async function getExerciseTime() {
		return await recordDTO.getTimeByDay(Number(moment().format('YYYYMMDD')));
	}

	// 총 운동 일자를 가져온다.
	async function yourExerciseDay() {
		return await recordDTO.getExerciseDay();
	}

	// 운동 종류에 대한 횟수를 가져온다.
	async function yourExerciseRecord() {
		return await recordDTO.getExerciseRecord();
	}


	// yourExerciseRecord 함수를 통해 불러온 운동 횟수 데이터가 elist에 저장이 됨. 비동기로 가져오기에 먼저 존재유무를 예외처리 하고 그 다음에 화면을 구성함.
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

	// 도넛모양 표를 만들기 위해 사용한 API에서 범례 옵션이 없어 직접 만든 범례 생성 함수이다.
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
