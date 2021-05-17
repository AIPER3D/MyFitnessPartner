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
    header: string;
	db: RxDatabase;
    children: React.ReactNode;
}

function CalendarModal({open, close, header, db, children}: Props) {
	const [memoDTO, setMemoDTO] = useState<MemoDTO>(new MemoDTO());
	const [refresh, setRefresh] = useState(false);
	const [memo, setMemo] = useState<any>([]);
	useEffect(()=>{
		memoDTO.setDB(db);
		(async () => {
			await generate();
		})();
	}, [db, refresh, header]);
	async function handleAdd() {
		const memo : MemoDAO =
		{
			memoId: new Date().getTime(),
			memoDate: header,
			memoType: 'memo',
			memoValue: '',
		};
		await memoDTO.addMemo(memo);
		onRefresh();
	}
	const onRefresh = () => {
		setRefresh(!refresh);
	};
	async function generate() {
		setMemo(await memoDTO.getMemo(header));
	}

	return (
		<div className={ open ? 'openModal modal' : 'modal' }>
			{ open ? (
				<section>
					<header>
						{header}
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
