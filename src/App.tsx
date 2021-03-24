import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { createRxDatabase, addRxPlugin, RxDatabase } from 'rxdb';

import { Menu } from './components/common';
import { VideoSchema, RoutineSchema } from './schema';
import {
	Main,
	Routines,
	RoutineCreate,
	Videos,
	VideoCreate,
	DB,
} from './pages';

const Root = styled.div`
	margin: 0px 0px 0px 0px;
	padding: 20px 0px 0px 0px;
`;

function App() {
	const [db, setDB] = useState<RxDatabase>();
	addRxPlugin(require('pouchdb-adapter-idb'));

	useEffect(() => {
		(async () => {
			if (db) return;

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

		return () => {
			if (db && !db.destoryed) {
				(async () => {
					// @ts-ignore
					// await db.destory();
				})();
			}
		};
	}, []);


	return (
		<Router>
			<Switch>
				<Route exact path="/videos/new">
					<Menu selected='videos' />
					<Root><VideoCreate /></Root>

				</Route>
				<Route exact path="/videos">
					<Menu selected='videos' />
					<Root><Videos db={ db } /></Root>
				</Route>
				<Route exact path="/routines/new">
					<Menu selected='routines' />
					<Root><RoutineCreate /></Root>
				</Route>
				<Route path="/routines">
					<Menu selected='routines' />
					<Root><Routines db={ db } /></Root>
				</Route>
				<Route path="/db">
					<Menu selected='main' />
					<Root><DB db={ db } /></Root>
				</Route>
				<Route path="/">
					<Menu selected='main' />
					<Root><Main /></Root>
				</Route>
			</Switch>
		</Router>
	);
}

export default App;
