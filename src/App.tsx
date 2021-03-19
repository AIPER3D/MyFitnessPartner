import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createRxDatabase, addRxPlugin, RxDatabase } from 'rxdb';

import { Menu } from './components/common';
import { Main, Videos, Routines, DB } from './pages';
import { VideoSchema, RoutineSchema } from './schema';


const Root = styled.div`
	height: calc(100vh - 40px);
	padding: 20px 0px 20px 0px;
`;

function App() {
	const [db, setDB] = useState<RxDatabase>();
	addRxPlugin(require('pouchdb-adapter-idb'));


	useEffect(() => {
		(async () => {
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
			setDB(undefined);
		};
	}, []);

	return (
		<div>
			<Router>
				<Switch>
					<Route path="/videos">
						<Menu selected={ 'videos' } />
						<Root>
							<Videos db={ db }/>
						</Root>
					</Route>
					<Route path="/routines">
						<Menu selected={ 'routines' } />
						<Root>
							<Routines db={ db } />
						</Root>
					</Route>
					<Route path="/db">
						<Menu selected={ 'db' } />
						<Root>
							<DB db={ db }/>
						</Root>
					</Route>
					<Route path="/">
						<Menu selected={ 'main' } />
						<Root>
							<Main />
						</Root>
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
