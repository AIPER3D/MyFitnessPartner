import React from 'react';
import './Calendar.scss';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import moment, { Moment as MomentTypes } from 'moment';

function Calendar() {
	function generate() {
		const today = moment();
		const startWeek = today.clone().startOf('month').week();
		let endWeek = today.clone().endOf('month').week();
		if (endWeek === 1) {
			endWeek = 53;
		}
		const calendar = [];
		for (let week = startWeek; week <= endWeek; week++) {
			calendar.push(
				<div className="row" key={week}>
					{
						Array(7).fill(0).map((n, i) => {
							let current = today.clone().week(week);
							current = current.startOf('week').add(n + i, 'day');
							let isSelected = '';
							if (today.format('YYYYMMDD') === current.format('YYYYMMDD')) {
								isSelected = 'selected';
							}
							let isGrayed = 'grayed';
							if (current.format('MM') === today.format('MM')) {
								isGrayed = '';
							}
							return (
								<div className={`box  ${isSelected} ${isGrayed}`} key={i}>
									<span className={`text`}>{current.format('D')}</span>
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
				<button><MdChevronLeft /></button>
				<span className="title">{moment().format('MMMM YYYY')}</span>
				<button><MdChevronRight /></button>
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
			</div>
		</div>
	);
}
export default Calendar;
