import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import { DevDB, DevExport, DevDelete } from './';
import { RxDatabase } from 'rxdb';

type PageProps = {
	db: RxDatabase | null;
};

function Main({ db } : PageProps) {
	return (
		<div>
			<ul>
				<li><Link to={ '/' } >일반 모드로 복귀</Link></li>
				<li><Link to={ '/dev/export' } >DB 내보내기</Link></li>
				<li><Link to={ '/dev/delete' } >DB 삭제</Link></li>
			</ul>

			<Router>
				<Switch>
					{ db ? (
						<Route path="/dev/export">
							<DevExport db = { db } />
						</Route>
					) : (
						<Route path="/dev/db">
							<DevDB />
						</Route>
					)}
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
