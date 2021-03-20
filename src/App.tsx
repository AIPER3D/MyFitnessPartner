import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { createRxDatabase, addRxPlugin, RxDatabase } from 'rxdb';
import Calendar from './components/calendar/Calendar';

import { Routines, Videos, DB } from './pages';
import {VideoSchema, RoutineSchema} from './schema';

// context API - provider
// 하위 컴포넌트에 넘겨줄수 있는 방법
// 이게 해결방법이 될 것 같음

function App() {
	const [db, setDB] = useState<RxDatabase>();

	useEffect(() => {
		(async () => {
			addRxPlugin(require('pouchdb-adapter-idb'));

			const tdb = await createRxDatabase({
				name: 'data',
				adapter: 'idb',
			});

			await tdb.collection({
				name: 'routines',
				schema: RoutineSchema,
			});

			await tdb.collection({
				name: 'videos',
				schema: VideoSchema,
			});

			setDB(tdb);
		})();
	}, []);


	return (
		<Router>
			<div>
				<nav>
					<ul>
						<li>
							<Link to="/">메인 화면</Link>
						</li>
						<li>
							<Link to="/videos">영상 관리</Link>
						</li>
						<li>
							<Link to="/routines">루틴 관리</Link>
						</li>
						<li>
							<Link to="/db">DB 생성</Link>
						</li>
					</ul>
				</nav>
				<div>
					<Calendar />
				</div>
				<Switch>
					<Route path="/videos">
						<Videos db={ db }/>
					</Route>
					<Route path="/routines">
						<Routines db={ db } />
					</Route>
					<Route path="/db">
						<DB db={ db }/>
					</Route>
					<Route path="/">
						<h2>Home</h2>
					</Route>
				</Switch>
			</div>
		</Router>
	);
}

export default App;
