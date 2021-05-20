import isElectron from 'is-electron';
import React, {useEffect, useState} from 'react';
import styled, { css } from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createRxDatabase, addRxPlugin, RxDatabase } from 'rxdb';

import { UserSchema, MemoSchema, VideoSchema, RoutineSchema, RecordSchema } from './db/schema';
import {
	Menu,
	Main,
	Video,
	Videos,
	VideoCreate,
	Routines,
	RoutineCreate,
	Record,
	Records,

	ExerciseReady,
	ExercisePlay,

	DevMain,
	Test,

	New,
	Reset,
} from './pages';
import Dashboard from './components/dashboard/dashboard';

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

const ContainerWithMenuUnlimit = styled.div`
	position: fixed;
	left: 250px; 
	width: calc(100vw - 250px);
	height: calc(100vh);
	overflow: auto;
		
	margin: 0;
	padding: 0;
`;

const Body = styled.div`
	width: 1000px;
	overflow: auto;
	
	margin: 0px auto 0px auto;
	padding: 20px 0px 0px 0px;
`;

function App() {
	const devMode = true;
	const [newMode, setNewMode] = useState<boolean>(true);
	const [db, setDB] = useState<RxDatabase | null>(null);

	addRxPlugin(require('pouchdb-adapter-idb'));

	useEffect(() => {
		(async () => {
			if (db) return;

			const tdb = await createRxDatabase({
				name: 'data',
				adapter: 'idb',
			});

			await tdb.collection({
				name: 'users',
				schema: UserSchema,
			});

			await tdb.collection({
				name: 'memos',
				schema: MemoSchema,
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
				name: 'records',
				schema: RecordSchema,
			});

			setDB(tdb);

			const doc = await tdb.collections.users
				.find()
				.exec();

			setNewMode(doc.length <= 0);
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

	if (db) {
		return (
			<Router>
				<Switch>
					{ devMode ? (
						<Route path="/dev">
							<ContainerWithoutMenu>
								<DevMain db = { db } />
							</ContainerWithoutMenu>
						</Route>
					) : (<Route path="/dev"></Route>)}
					{ newMode ? (
						<Route path="/">
							<ContainerWithoutMenu>
								<New db = { db } />
							</ContainerWithoutMenu>
						</Route>
					) : (<Route path="/new"></Route>)}
					<Route path="/exercisePlay/:id">
						<ContainerWithoutMenu>
							<ExercisePlay db={ db }/>
						</ContainerWithoutMenu>
					</Route>
					<Route path="/reset">
						<ContainerWithoutMenu>
							<Reset db={ db }/>
						</ContainerWithoutMenu>
					</Route>
					<Route path="/:route">
						<Menu db = { db } />
						<ContainerWithMenu>
							<Body>
								<Switch>
									<Route path="/test">
										<Test db={ db }/>
									</Route>
									<Route path="/exerciseReady/:page">
										<ExerciseReady db={ db }/>
									</Route>
									<Route path="/video/:id">
										<Video db={ db } />
									</Route>
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
									<Route path="/record/:id">
										<Record db={ db } />
									</Route>
									<Route path="/records/:page">
										<Records db={ db } />
									</Route>
									<Route exact path="/">
										<Main db={ db } />
									</Route>
								</Switch>
							</Body>
						</ContainerWithMenu>
						<Switch>
							<Route exact path="/dashboard">
								<ContainerWithMenuUnlimit>
									<Dashboard db={ db } />
								</ContainerWithMenuUnlimit>
							</Route>
						</Switch>
					</Route>
				</Switch>
				<Route path="/">
					<Menu db = { db } />
					<ContainerWithMenu>
						<Body>
							<Main db={ db } />
						</Body>
					</ContainerWithMenu>
				</Route>
			</Router>
		);
	} else {
		return (
			<Router>
				<Switch>
					{ devMode ? (
						<Route path="/">
							<ContainerWithoutMenu>
								<DevMain db = { db } />
							</ContainerWithoutMenu>
						</Route>
					) : (<Route path="/"></Route>)}
				</Switch>
			</Router>
		);
	}
}

export default App;
