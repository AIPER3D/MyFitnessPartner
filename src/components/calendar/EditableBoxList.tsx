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
	const [memoDTO, setMemoDTO] = useState<MemoDTO>(new MemoDTO());
	const [memo, setMemo] = useState<any>([]);
	useEffect(()=>{
		console.log(db);
		memoDTO.setDB(db);
		(async () => {
			await generate();
		})();
	}, [db]);


	async function generate() {
		setMemo(await memoDTO.getMemo(date));
	}
	const editableBox = [];
	if (memo) {
		console.log(memo);
		for (let i=0; i < memo.length; i++) {
			editableBox.push(<CalendarEditableBox init={memo[i]['memoValue']}
				key={memo[i]['memoId']}/>);
		}
		console.log(memoDTO.getCount(date));
	}

	return (
		<div>
			{editableBox}
		</div>

	);
}

export default EditableBoxList;
