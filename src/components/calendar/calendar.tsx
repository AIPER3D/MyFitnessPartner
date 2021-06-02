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

function Calendar({db} : CalendarProps) {
	const [date, setDate] = useState<MomentTypes>(moment());
	const [modalOpen, setModalOpen] = useState(false);
	const [present, setPresent] = useState<Moment>(moment());
	const [memoDTO, setMemoDTO] = useState<MemoDTO>(new MemoDTO());
	const recordDTO = new RecordDTO();
	const [records, setRecords] = useState<RecordDAO[] | null>(null);
	useEffect(()=>{
		memoDTO.setDB(db);
		recordDTO.setDB(db);
	}, [db]);
	useEffect(()=> {
		(async ()=>{
			setRecords(await recordDTO.getExerciseDayRecord(Number(present.format('YYYYMMDD'))));
		})();
	}, [present]);
	const openModal= (day:Moment)=>{
		setModalOpen(true);
		setPresent(day);
		console.log(records);
	};
	const closeModal= ()=> {
		setModalOpen(false);
	};
	function handleMonthInc() {
		setDate(date.clone().add(1, 'month'));
	}
	function handleMonthDec() {
		setDate(date.clone().subtract(1, 'month'));
	}
	function generateRecord() {
		const list = [];

		if (records) {
			list.push(
				<div className='modal_record'>
					{
						Array(records.length).map((n, i) => {
							return (
								<span className='record' key={i} >
									{records[n+i].routineName}, {records[n+i].playTime}
								</span>
							);
						})
					}
				</div>
			);
		}

		return list;
	}

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
