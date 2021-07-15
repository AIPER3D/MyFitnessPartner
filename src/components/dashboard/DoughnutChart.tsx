import '../../../node_modules/react-vis/dist/style.css';
import { RadialChart} from 'react-vis';
import './DoughnutChart.scss';
type Props = {
	list: any;
}
/* 구현자 : 김인환
Chart.tsx와 마찬가지로 react-vis API를 활용하여 만든 도넛 그래프 컴포넌트이다.
운동의 비율을 통해 얼마나 적절한 비율로 운동하는지를 나타내는 것이 필요하다 생각해서 구현하게 되었다.
*/
function DoughnutChart({list} : Props) {
	let data : any = [];
	if (list) {
		if (list.Squat === 0 && list.Jump === 0 && list.Lunge === 0) { // 비동기이기 때문에 데이터가 없을 경우의 초기값을 세팅해 주었다.
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
