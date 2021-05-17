import { RxDatabase } from 'rxdb';
import React, {useEffect, useState} from 'react';
import './dashboard.scss';
import Chart from './Chart';
import DoughnutChart from './DoughnutChart';
type DashBoardProps = {
	db : RxDatabase;
}
function Dashboard({db}: DashBoardProps) {
	useEffect(()=>{
	}, [db]);

	function yourCalory() {
		return 1300;
	}

	function yourExerciseTime() {
		return 30;
	}

	function yourExerciseDay() {
		return 7;
	}

	function mostExercise() {
		const cards = [];

		for (let i =1; i < 5; i++) {
			cards.push(
				<div className={`card${i}`}>
					<h1>exercise{i}</h1>
					<p>{i}</p>
				</div>
			);
		}
		return cards;
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
							<p className="text-primary-p"> 하루평균 <br /> 소모열량 </p>
							<span className="font-bold text-title"> {yourCalory()} Kcal</span>
						</div>
					</div>
					<div className="card">
						<i className="far fa-clock fa-2x text-dark"></i>
						<div className="card_inner">
							<p className="text-primary-p"> 오늘 운동시간 </p>
							<span className="font-bold text-title"> {yourExerciseTime()} 분</span>
						</div>
					</div>
					<div className="card">
						<i className="fa fa-calendar fa-2x text-red"></i>
						<div className="card_inner">
							<p className="text-primary-p"> 총 운동 날짜 </p>
							<span className="font-bold text-title"> {yourExerciseDay()} 일</span>
						</div>
					</div>
				</div>
				<div className="charts">
					<div className="charts_exerciseAmount">
						<div className="charts_exerciseAmount_title">
							<div>
								<h1>일간 운동량</h1>
							</div>
						</div>
						<Chart />
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
						</div>
						<DoughnutChart />
					</div>
				</div>
			</div>
		</main>
	);
}


export default Dashboard;
