import React, { useEffect, useState } from 'react';
import { RxDatabase } from 'rxdb';
import { generate } from 'rxjs';
import { MemoDAO } from '../../db/DAO/memoDAO';
import { MemoDTO } from '../../db/DTO/memoDTO';
import CalendarEditableBox from './CalendarEditableBox';

type Props = {
    date: string;
    db: RxDatabase;
}
function EditableBoxList({date, db} : Props) {
	const memoDTO = new MemoDTO();
	useEffect(()=>{
		memoDTO.setDB(db);
	}, [db]);


	async function generate() {
		const editableBox = [];
		const memo : MemoDAO[] = await memoDTO.getMemo(date);

		for (let i=0; i <= memo.length; i++) {
			editableBox.push(<CalendarEditableBox init={memo[i]['memoValue']}/>);
		}

		return editableBox;
	}
	return (
		<div>
			{generate()}
		</div>

	);
}

export default EditableBoxList;
