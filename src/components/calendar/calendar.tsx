import React, {useEffect, useState} from 'react';
import './calendar.scss';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import moment, { Moment, Moment as MomentTypes } from 'moment';
import CalendarModal from './CalendarModal';
import { RxDatabase } from 'rxdb';
import { MemoDTO } from '../../db/DTO/memoDTO';
import { RecordDTO } from '../../db/DTO/recordDTO';
import { RecordDAO } from '../../db/DAO/recordDAO';

type CalendarProps = {
	db : RxDatabase;
}

/* 구현자 : 김인환
내가 운동한 날짜의 정보를 쉽게 확인하기 위해선 캘린더 형태의 컴포넌트가 필요했다. 그래서 만들게 되었고
우리 프로그램의 기획 의도는 사용자가 직접 기록하는 여타의 운동 기록 프로그램과 달리 딥러닝 모델을 통해 자동으로 운동의 정보가 기록되고, 이 기록들을 쉽게 열람하여
운동 루틴을 명확히 파악하게 하여 건강한 운동을 하는 데 도움이 되도록 하였기 때문에 이러한 운동 정보를 접근하는 데 얼마나 직관적인지가 중요했다.
moment.js를 이용하여 간단하게 캘린더를 구현하였다.
헤더에 년도와 월 양쪽에 존재하는 화살표를 누르면 그 전, 이후 월로 바뀌고, 각 일자를 누르면 그 일자에 대한 운동 기록과 메모 정보가 나오는 모달 창이 나오게 된다.
*/


function Calendar({db} : CalendarProps) {
	const [date, setDate] = useState<MomentTypes>(moment()); // 캘린더를 생성하는데 핵심인 날짜 정보 변수이다. 다른 날짜로 변경되지 않는다. 오늘 날짜를 가리킴.
	const [modalOpen, setModalOpen] = useState(false); // 모달을 작동하기 위한 상태 변수이다.
	const [present, setPresent] = useState<Moment>(moment()); // 내가 클릭한 날짜로 세팅되는 날짜 정보 변수이다.
	const [memoDTO, setMemoDTO] = useState<MemoDTO>(new MemoDTO());
	const [recordDTO, setRecordDTO] = useState<RecordDTO>(new RecordDTO());
	const [records, setRecords] = useState<RecordDAO[] | null>(null); // 날짜의 운동 기록을 담기 위한 record 변수이다.
	useEffect(()=>{ // db 변경에 따라 최신화 하기 위해 사용하는 useEffect 함수이다.
		memoDTO.setDB(db);
		recordDTO.setDB(db);
	}, [db]);
	useEffect(()=> { // 클릭한 날짜의 변경은 수시로 일어나기에 그 변경에 따른 기록 검색을 위한 함수이다.
		(async ()=>{
			setRecords(await recordDTO.getExerciseDayRecord(Number(present.format('YYYYMMDD'))));
		})();
	}, [present]);

	// 각 날짜를 클릭했을 때 모달을 띄우기 위해 실행되는 함수이다.
	const openModal= (day:Moment)=>{
		setModalOpen(true);
		setPresent(day);
	};

	// 모달에서 종료 버튼을 눌렀을 때, 모달 자체는 이 Calendar 컴포넌트에서 작성돼있으므로 이곳에서 상태를 변경해야 하기 때문에
	// 이곳에 종료 함수가 존재하고 이 함수를 모달 컴포넌트에 Props로 전달한다.
	const closeModal= ()=> {
		setModalOpen(false);
	};

	// 각 화살표를 눌러 월 정보를 변경하고자 할 때 대응하는 함수이다.
	function handleMonthInc() {
		setDate(date.clone().add(1, 'month'));
	}
	function handleMonthDec() {
		setDate(date.clone().subtract(1, 'month'));
	}


	// 불러온 운동 기록을 화면에 뿌려주기 위해 실행되는 함수이다. 루틴 명과 운동 시간을 표시한다.
	function generateRecord() {
		const body = [];
		const list = [];

		if (records) {
			for (let i=0; i< records.length; i++) {
				list.push(
					<div className='modal_record' key={i}>
						{
							<span className='record' key={records[i].id} >
								{records[i].routineName}, {records[i].playTime.toFixed(2)} 분
							</span>
						}
					</div>
				);
			}
		}
		body.push(
			<div className='modal_record' key= {1}>
				{list}
			</div>
		);
		return body;
	}
	/* 캘린더를 생성하는 핵심 함수이다. moment.js를 import하여 사용한다. 자세한 생성 방식은 현재 날짜를 기준으로 생성하는데,
	현재 날짜를 기준으로 시작하는 주와 끝나는 주를 moment 객체를 이용하여 구해 낸다. 그리고 만약 끝나는 주가 1월로 넘어가는 경우까지 예외처리를 하고,
	각 주일마다 for문으로 일자에 대한 html을 생성하여 map 연산으로 집어넣는다. 만약 이 날짜가 오늘이라면 tag에 isSelected가 표시될 것이고
	현재 날짜가 같은 주이지만 현재 월 이전이거나 초과한 경우에는 현재 월이 아님을 표시하기 위해 tag애 isGray가 표시될 것이다.
	*/
	function generate() {
		const today = moment();
		const startWeek = date.clone().startOf('month').week();
		let endWeek = date.clone().endOf('month').week();
		if (endWeek === 1) {
			endWeek = 53;
		}
		const calendar = [];
		for (let week = startWeek; week <= endWeek; week++) {
			calendar.push(
				<div className="row" key={week}>
					{
						Array(7).fill(0).map((n, i) => {
							let current = date.clone().startOf('year').week(week);
							current = current.startOf('week').add(n + i, 'day');
							let isSelected = '';
							if (date.format('YYYYMMDD') === current.format('YYYYMMDD') &&
							date.format('YYYYMMDD') === today.format('YYYYMMDD')) {
								isSelected = 'selected';
							}
							let isGrayed = 'grayed';
							if (current.format('MM') === date.format('MM')) {
								isGrayed = '';
							}
							return (
								<div className={`box  ${isSelected} ${isGrayed}`} key={i}>
									<span className={`text`} onClick={
										()=>openModal(current)}>
										{current.format('D')}
									</span>
								</div>
							);
						})
					}
				</div>
			);
		}
		return calendar;
	}

	return (
		<div className="Calendar">
			<div className="head">
				<button onClick = {() => setDate(date.clone().subtract(1, 'month'))}>
					<MdChevronLeft />
				</button>
				<span className="title">{date.format('MMMM YYYY')}</span>
				<button onClick = {() => setDate(date.clone().add(1, 'month'))}>
					<MdChevronRight />
				</button>
			</div>
			<div className="body">
				<div className="row">
					<div className="box_day">
						<span className="text">SUN</span>
					</div>
					<div className="box_day">
						<span className="text">MON</span>
					</div>
					<div className="box_day">
						<span className="text">TUE</span>
					</div>
					<div className="box_day">
						<span className="text">WED</span>
					</div>
					<div className="box_day">
						<span className="text">THU</span>
					</div>
					<div className="box_day">
						<span className="text">FRI</span>
					</div>
					<div className="box_day">
						<span className="text">SAT</span>
					</div>
				</div>
				{generate()}
				<div className='modal_div'>
					<CalendarModal open={ modalOpen } close={ closeModal }
						header={ present } db={db}>
						{generateRecord()}
					</CalendarModal>
				</div>
			</div>
		</div>
	);
}
export default Calendar;
