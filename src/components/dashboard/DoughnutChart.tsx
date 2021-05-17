import '../../../node_modules/react-vis/dist/style.css';
import { RadialChart} from 'react-vis';

function DoughnutChart() {
	const data = [
		{angle: 6, radius: 2, label: 'A', color: 'red', padAngle: 1},
		{angle: 3, radius: 2, label: 'B', color: 'green', padAngle: 1},
		{angle: 2, radius: 2, label: 'C', color: 'blue', padAngle: 1},
	];


	return (
		<div style={{ marginTop: '15px', marginLeft: '50px'}}>
			<RadialChart
				data={data}
				width={300}
				height={300}
				radius={90}
				innerRadius={60}
				showLabels={true} />
		</div>
	);
}


export default DoughnutChart;
