import isElectron from 'is-electron';
import React, {useEffect, useState} from 'react';
import styled, { css } from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createRxDatabase, addRxPlugin, RxDatabase } from 'rxdb';

import { VideoSchema, RoutineSchema, MemoSchema } from './db/schema';
import {
	Main,
	Menu,
	Routines,
	RoutineCreate,
	Videos,
	VideoCreate,
	Exercise,
	Exercise2,

	DevMain,
	DevDB,
} from './pages';

declare global {
	interface Window {
		api: any;
	}
}
const ContainerWithMenu = styled.div`
	position: fixed;
	left: 250px; 
	width: calc(100vw - 250px - 20px);
	height: calc(100vh - 20px);
	overflow: auto;
		
	margin: 0px auto 0px auto;
	padding: 20px 0px 0px 20px;
`;

const ContainerWithoutMenu = styled.div`
	position: fixed;
	left: 0px; 
	width: 100vw;
	height: 100vh;
	overflow: auto;
	
	margin: 0px;
	padding: 0px;
`;

const Body = styled.div`
	width: 1000px;
	overflow: auto;
	
	margin: 0px auto 0px auto;
	padding: 20px 0px 0px 0px;
`;

function App() {
	const devMode = false;
	const [db, setDB] = useState<RxDatabase>();

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

			await tdb.collection({
				name: 'memos',
				schema: MemoSchema,
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
				<ContainerWithoutMenu>
					<Switch>
						<Route path="/db">
							<DevDB />
						</Route>
						<Route path="/">
							<DevMain />
						</Route>
					</Switch>
				</ContainerWithoutMenu>
			</Router>
		);
	} else if (db) {
		return (
			<Router>
				<Switch>
					<Route path="/exercise">
						<ContainerWithoutMenu>
							<Exercise db={ db }/>
						</ContainerWithoutMenu>
					</Route>
					<Route path="/exercise2">
						<ContainerWithoutMenu>
							<Exercise2 db={ db }/>
						</ContainerWithoutMenu>
					</Route>
					<Route path="/:route">
						<Menu />
						<ContainerWithMenu>
							<Body>
								<Switch>
									<Route exact path="/videos/new">
										<VideoCreate db={ db } />
									</Route>
									<Route exact path="/videos/:page">
										<Videos db={ db } />
									</Route>
									<Route exact path="/routines/new">
										<RoutineCreate db={ db } />
									</Route>
									<Route path="/routines/:page">
										<Routines db={ db } />
									</Route>
									<Route path="/">
										<Main db={ db } />
									</Route>
								</Switch>
							</Body>
						</ContainerWithMenu>
					</Route>
					<Route path="/">
						<Menu />
						<ContainerWithMenu>
							<Body>
								<Main db={ db } />
							</Body>
						</ContainerWithMenu>
					</Route>
				</Switch>
			</Router>
		);
	} else {
		return (
			<ContainerWithoutMenu>
				<p>DB 접속 오류</p>
			</ContainerWithoutMenu>
		);
	}
}

export default App;
