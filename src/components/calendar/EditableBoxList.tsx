import React, { useEffect, useState } from 'react';
import { RxDatabase } from 'rxdb';
import { generate } from 'rxjs';
import styled from 'styled-components';
import { MemoDAO } from '../../db/DAO/memoDAO';
import { MemoDTO } from '../../db/DTO/memoDTO';
import CalendarEditableBox from './CalendarEditableBox';
import './EditableBoxList.scss';

type Props = {
    memos: any[];
	onRefresh: () => void;
    db: RxDatabase;
}

/* 구현자 : 김인환
CalendarEditableBox.tsx 이 컴포넌트를 바로 리스트로 구현하여 사용하기 보다, 각 메모에 대한 컴포넌트를
리스트화 하는 컴포넌트를 하나 더 생성하여 그걸 이용해서 모달에 띄우는 편이 더 코드 수정이나 기능을 파악하는데 도움이 된다 생각하여 이런 식으로 작성하였다.
*/
function EditableBoxList({memos, onRefresh, db} : Props) {
	const [memoDTO, setMemoDTO] = useState<MemoDTO>(new MemoDTO());
	useEffect(()=>{
		memoDTO.setDB(db);
	}, [db]);

	const editableBox = [];
	if (memos) {
		for (let i=0; i < memos.length; i++) {
			// 이러한 방식으로 객체에 push할 때 유니크 키 없이 집어넣게 되면 error가 발생하므로 객체의 키를 집어넣어 에러를 방지해야 한다.
			editableBox.push(<CalendarEditableBox memo={memos[i]}
				onRefresh={ onRefresh } db={db} key={memos[i]['memoId']}/>);
		}
	}

	return (
		<div className="List_box">
			{editableBox}
		</div>

	);
}

export default EditableBoxList;
