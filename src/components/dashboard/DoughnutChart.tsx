import '../../../node_modules/react-vis/dist/style.css';
import { RadialChart} from 'react-vis';
import './DoughnutChart.scss';

function DoughnutChart() {
	const data = [
		{angle: 6, radius: 1.7, color: 1, padAngle: -10, className: 'first'},
		{angle: 3, radius: 1.7, color: 3, padAngle: 0, className: 'second'},
		{angle: 2, radius: 1.7, color: 2, padAngle: 0, className: 'third'},
	];


	return (
		<div style={{ marginTop: '15px', marginLeft: '50px'}}>
			<RadialChart
				data={data}
				width={300}
				height={300}
				radius={90}
				innerRadius={60}
				showLabels={true}
				labelsAboveChildren={true}
				labelsRadiusMultiplier={0.7}
				className="doughnut" />
		</div>
	);
}


export default DoughnutChart;
