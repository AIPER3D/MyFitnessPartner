import isElectron from 'is-electron';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createRxDatabase, addRxPlugin, RxDatabase } from 'rxdb';

import { Menu } from './components/common';
import { VideoSchema, RoutineSchema } from './db/schema';
import {
	Main,
	Routines,
	RoutineCreate,
	Videos,
	VideoCreate,
	DB,
} from './pages';

declare global {
	interface Window {
		api: any;
	}
}

const Root = styled.div`
	position: fixed;
	left: 250px; 
	width: calc(100vw - 250px - 20px);
	height: calc(100vh - 20px);
	margin: 0px auto 0px auto;
	padding: 20px 0px 0px 20px;
	
	overflow: auto;
`;

const Body = styled.div`
	width: 1000px;
	margin: 0px auto 0px auto;
	padding: 20px 0px 0px 0px;
	
	overflow: hidden;
`;

function App() {
	const devMode = false;
	const [db, setDB] = useState<RxDatabase>();
	const [page, setPage] = useState<string>('');

	addRxPlugin(require('pouchdb-adapter-idb'));

	useEffect(() => {
		(async () => {
			if (devMode) return;
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

	if (devMode) {
		return (
			<Router>
				<Menu devMode={ devMode } selected={ page } />
				<Root>
					<Body>
						<Switch>
							<Route path="/db">
								<DB setPage={ setPage } />
							</Route>
						</Switch>
					</Body>
				</Root>
			</Router>
		);
	} else if (db) {
		return (
			<Router>
				<Menu devMode={ devMode } selected={ page } />
				<Root>
					<Body>
						<Switch>
							<Route exact path="/videos/new">
								<VideoCreate db={ db } setPage={ setPage } />
							</Route>
							<Route exact path="/videos">
								<Videos db={ db } setPage={ setPage } />
							</Route>
							<Route exact path="/routines/new">
								<RoutineCreate db={ db } setPage={ setPage } />
							</Route>
							<Route path="/routines">
								<Routines db={ db } setPage={ setPage } />
							</Route>
							<Route path="/">
								<Main db={ db } setPage={ setPage } />
							</Route>
						</Switch>
					</Body>
				</Root>
			</Router>
		);
	} else {
		return (
			<Router>
				<Menu devMode = { false } selected={ page } />
				<Root>
					<Body>
						<p>DB 접속 오류</p>
					</Body>
				</Root>
			</Router>
		);
	}
}

export default App;
