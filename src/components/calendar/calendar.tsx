import React, {useState} from 'react';
import './Calendar.scss';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import moment, { Moment as MomentTypes } from 'moment';
import CalendarModal from './CalendarModal';


function Calendar() {
	const [date, setDate] = useState<MomentTypes>(moment());
	const [modalOpen, setModalOpen] = useState(false);
	const [present, setPresent] = useState<string>('');
	const openModal= (day:string)=>{
		setModalOpen(true);
		setPresent(day);
		console.log(modalOpen);
	}
	const closeModal= ()=> {
		setModalOpen(false);
		setPresent('');
		console.log(modalOpen);
	}
 	function handleMonthInc() {
		setDate(date.clone().add(1, 'month'));
	}
	function handleMonthDec() {
		setDate(date.clone().subtract(1, 'month'));
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
							if (date.format('YYYYMMDD') === current.format('YYYYMMDD') 
							&& date.format('YYYYMMDD') === today.format('YYYYMMDD')) {
								isSelected = 'selected';
							}
							let isGrayed = 'grayed';
							if (current.format('MM') === date.format('MM')) {
								isGrayed = '';
							}
							return (
								<div className={`box  ${isSelected} ${isGrayed}`} key={i}>
									<span className={`text`} onClick={()=>openModal(current.format('YYYYMMDD'))}>{current.format('D')}</span>
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
				<div>
					<CalendarModal open={ modalOpen } close={ closeModal } header={ present }>
						abcd
					</CalendarModal>
				</div>
			</div>
		</div>
	);
}
export default Calendar;
