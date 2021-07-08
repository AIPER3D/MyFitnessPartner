import { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import { RxDatabase } from 'rxdb';
import { MemoDAO } from '../../db/DAO/memoDAO';
import { MemoDTO } from '../../db/DTO/memoDTO';
import CalendarEditableBox from './CalendarEditableBox';
import './CalendarModal.scss';
import EditableBoxList from './EditableBoxList';


type Props = {
    open: Boolean;
    close: () => void;
    header: Moment;
	db: RxDatabase;
    children: React.ReactNode;
}


/* 구현자 : 김인환
캘린더의 각 날짜를 클릭하면 나와야 할 그 날짜에 대한 세부 운동 기록을 표시하기 위해 만든 컴포넌트이다.
이러한 식으로 같은 페이지에서 모달 형식으로 띄우는 것이 좀 더 접근성이 좋을 것이라 생각하였다.
먼저 각 날짜에 진행한 운동 루틴 이름과 진행한 운동 시간이 나오며, 중간 구분선을 기준으로 아래에는
이 날짜에 작성한 메모들을 리스트 형식으로 보여준다.
*/

function CalendarModal({open, close, header, db, children}: Props) {
	const [memoDTO, setMemoDTO] = useState<MemoDTO>(new MemoDTO());
	const [refresh, setRefresh] = useState(false);
	const [memo, setMemo] = useState<any>([]); /* 현재 header 날짜에 맞는 메모들을 담기 위한 객체이다.
	이렇게 useState로 작성하지 않을 경우에, memo들은 비동기로 db에서 가져오므로 화면에 표시되는 memo 객체는 없을수도 있을 수도 있게 된다.*/

	// 각각 db, refresh, header가 변경될 경우 DTO를 통해 다시 db를 불러오게 된다. 결국 modal은 한개에서 header만 바뀌며 넘어오기에 header 변경유무도 중요하다.
	useEffect(()=>{
		memoDTO.setDB(db);
		(async () => {
			await generate();
		})();
	}, [db, refresh, header]);

	// 모달 창에서 추가 버튼을 눌렀을 경우 새로운 메모를 추가하기 위한 함수이다.
	async function handleAdd() {
		const memo : MemoDAO =
		{
			memoId: new Date().getTime(),
			memoDate: header.format('YYYYMMDD'),
			memoType: 'memo',
			memoValue: '',
		};
		await memoDTO.addMemo(memo);
		onRefresh(); // 추가한 메모를 표시하기 위해 refresh 변수를 변경하여 useEffect를 호출한다.
	}

	// 단순히 useEffect 호출을 위한 함수이다.
	const onRefresh = () => {
		setRefresh(!refresh);
	};

	// 현재 header 날짜에 맞는 메모들을 memo 변수에 담는 함수이다.
	async function generate() {
		setMemo(await memoDTO.getMemo(header.format('YYYYMMDD')));
	}

	return (
		<div className={ open ? 'openModal modal' : 'modal' }>
			{ open ? (
				<section>
					<header>
						{header.format('YY년 MM월 DD일')}
						<button className="close" onClick={close}> &times; </button>
					</header>
					<main>
						{children}
						<EditableBoxList memos={memo} onRefresh={onRefresh} db={db}/>
						<button className="add" onClick={handleAdd}> &#43; </button>
					</main>
					<footer>
						<button className="close" onClick={close}> close </button>
					</footer>
				</section>
			) : null }
		</div>
	);
}

export default CalendarModal;
