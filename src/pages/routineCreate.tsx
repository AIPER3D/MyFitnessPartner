import React, { useEffect, useState } from 'react';
import { Header } from '../components/common';
import { DraggableList } from '../components/draggableList';

function RoutineCreate() {
	return (
		<div>
			<Header text='나만의 루틴 만들기' />
			<DraggableList />
		</div>
	);
}

export default RoutineCreate;
