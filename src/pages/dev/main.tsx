import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import { DevDB, DevExport, DevDelete } from './';

function Main() {
	return (
		<div>
			<ul>
				<li><a href={ '/' } >일반 모드로 복귀</a></li>
				<li><a href={ '/dev/db' } >DB 생성</a></li>
				<li><a href={ '/dev/export' } >DB 내보내기</a></li>
				<li><a href={ '/dev/delete' } >DB 삭제</a></li>
			</ul>

			<Router>
				<Switch>
					<Route path="/dev/db">
						<DevDB />
					</Route>
					<Route path="/dev/export">
						<DevExport />
					</Route>
					<Route path="/dev/delete">
						<DevDelete />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

Main.MenuProps = {

};

export default Main;
