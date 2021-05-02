import React, { useEffect } from 'react';
import { removeRxDatabase } from 'rxdb';
import { Link } from 'react-router-dom';


function Delete() {
	useEffect(() => {
		(async () => {
			await removeRxDatabase('data', 'idb');
		})();
	}, []);

	return (
		<div>
			<p>데이터베이스 삭제</p>
			<ul>
				<li><Link to={ '/dev' } >돌아가기</Link></li>
			</ul>
		</div>
	);
}

export default Delete;
