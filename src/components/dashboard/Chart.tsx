import '../../../node_modules/react-vis/dist/style.css';
import { XYPlot, LineSeries, XAxis, YAxis, VerticalGridLines, HorizontalGridLines } from 'react-vis';

function Chart() {
	const Wdata = [
		{ x: 0, y: 35},
		{ x: 1, y: 0},
		{ x: 2, y: 50},
		{ x: 3, y: 45},
		{ x: 4, y: 70},
		{ x: 5, y: 20},
		{ x: 6, y: 60},
	];
	return (
		<div style={{ marginTop: '15px'}}>
			<XYPlot height={300} width={300}>
				<VerticalGridLines />
				<HorizontalGridLines />
				<XAxis />
				<YAxis />
				<LineSeries data={Wdata}/>
			</XYPlot>
		</div>
	);
}

export default Chart;
