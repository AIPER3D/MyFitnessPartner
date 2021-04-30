import React from 'react';
import { Link } from 'react-router-dom';

function Main() {
	return (
		<div>
			<Link to={ '/db'} >DB 생성</Link>
		</div>
	);
}

Main.MenuProps = {

};

export default Main;
