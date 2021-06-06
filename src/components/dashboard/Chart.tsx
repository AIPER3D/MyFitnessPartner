import '../../../node_modules/react-vis/dist/style.css';
import { XYPlot, LineSeries, XAxis, YAxis, VerticalGridLines, HorizontalGridLines } from 'react-vis';
import { RxDatabase } from 'rxdb';
import { useEffect, useState } from 'react';
import { RecordDTO } from '../../db/DTO/recordDTO';
import moment from 'moment';
type Props = {
	db: RxDatabase;
}
function Chart({db}: Props) {
	const recordDTO = new RecordDTO();
	const [records, setRecords] = useState<number[] | null>(null);
	useEffect(()=>{
		recordDTO.setDB(db);
		(async ()=>{
			setRecords(await getRecords());
		})();
	}, [db]);
	async function getRecords() {
		const result = [];

		for (let i=0; i<7; i++) {
			result.push(await recordDTO.getTimeByDay(Number(moment().startOf('week').day(i).format('YYYYMMDD'))));
		}

		return result;
	}
	let Wdata = [
		{ x: 0, y: 0},
		{ x: 1, y: 0},
		{ x: 2, y: 0},
		{ x: 3, y: 0},
		{ x: 4, y: 0},
		{ x: 5, y: 0},
		{ x: 6, y: 0},
	];
	if (records) {
		Wdata = [
			{ x: 0, y: records[0]},
			{ x: 1, y: records[1]},
			{ x: 2, y: records[2]},
			{ x: 3, y: records[3]},
			{ x: 4, y: records[4]},
			{ x: 5, y: records[5]},
			{ x: 6, y: records[6]},
		];
	}

	const Date1 = ['일', '월', '화', '수', '목', '금', '토'];
	return (
		<div style={{ marginTop: '15px'}}>
			<XYPlot height={300} width={300}>
				<VerticalGridLines />
				<HorizontalGridLines />
				<XAxis tickValues={[]} title='일자'/>
				<XAxis tickFormat={(v) => Date1[v]} />
				<YAxis title='운동시간 (분)'/>
				<LineSeries data={Wdata} color='red'/>
			</XYPlot>
		</div>
	);
}

export default Chart;
