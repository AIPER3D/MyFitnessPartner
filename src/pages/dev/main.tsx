import React from 'react';
import { Link } from 'react-router-dom';

function Main() {
	return (
		<div>
			<ul>
				<li><Link to={ '/db'} >DB 생성</Link></li>
			</ul>
		</div>
	);
}

Main.MenuProps = {

};

export default Main;
