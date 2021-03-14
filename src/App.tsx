import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';

import { Routines, Videos } from './pages';

function App() {
	return (
		<Router>
			<div>
				<nav>
					<ul>
						<li>
							<Link to="/">메인 화면</Link>
						</li>
						<li>
							<Link to="/routines">루틴 관리</Link>
						</li>
					</ul>
				</nav>

				<Switch>
					<Route path="/routines">
						<Routines />
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
