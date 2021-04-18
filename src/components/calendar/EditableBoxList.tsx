import React, { useEffect, useState } from 'react';
import { RxDatabase } from 'rxdb';
import { generate } from 'rxjs';
import { MemoDAO } from '../../db/DAO/memoDAO';
import { MemoDTO } from '../../db/DTO/memoDTO';
import CalendarEditableBox from './CalendarEditableBox';

type Props = {
    memos: any[];
	onRefresh: () => void;
    db: RxDatabase;
}
function EditableBoxList({memos, onRefresh, db} : Props) {
	const [memoDTO, setMemoDTO] = useState<MemoDTO>(new MemoDTO());
	useEffect(()=>{
		memoDTO.setDB(db);
	}, [db]);

	const editableBox = [];
	if (memos) {
		for (let i=0; i < memos.length; i++) {
			editableBox.push(<CalendarEditableBox memo={memos[i]}
				onRefresh={ onRefresh } db={db} key={memos[i]['memoId']}/>);
		}
	}


	return (
		<div>
			{editableBox}
		</div>

	);
}

export default EditableBoxList;
