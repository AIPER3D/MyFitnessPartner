import '../../../node_modules/react-vis/dist/style.css';
import { RadialChart} from 'react-vis';
import './DoughnutChart.scss';
type Props = {
	list: any;
}
function DoughnutChart({list} : Props) {
	let data : any = [];
	if (list) {
		if (list.Squat === 0 && list.Jump === 0 && list.Lunge === 0) {
			data = [
				{angle: 1, radius: 1.7, color: 1, padAngle: 0, className: 'first'},
			];
		} else {
			data = [
				{angle: list.Squat, radius: 1.7, color: 1, padAngle: 0, className: 'first'},
				{angle: list.Jump, radius: 1.7, color: 3, padAngle: 0, className: 'second'},
				{angle: list.Lunge, radius: 1.7, color: 2, padAngle: 0, className: 'third'},
			];
		}
	}


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
