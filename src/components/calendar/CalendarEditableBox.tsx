import React, { useState, useEffect } from 'react';
import './CalendarEditableBox.scss';
import { RxDatabase } from 'rxdb';
import { MemoDTO } from '../../db/DTO/memoDTO';
import { MemoDAO } from '../../db/DAO/memoDAO';
type Props = {
	memo: MemoDAO;
	onRefresh: ()=>void;
	db: RxDatabase;
}

function CalendarEditableBox({ memo, onRefresh, db } : Props) {
	const [text, setText] = useState<string>(memo['memoValue']);
	const [previousText, setPText] = useState<string>('');
	const [editable, setEditable] = useState(false);
	const [memoDTO, setMemoDTO] = useState<MemoDTO>(new MemoDTO());
	useEffect(()=>{
		memoDTO.setDB(db);
	}, [db]);
	const editOn = () => {
		setPText(text);
		setEditable(true);
	};
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setText(e.target.value);
	};
	const editSave = () => {
		setEditable(false);
		onChangeValue();
		onRefresh();
	};
	const handleKeyDown = (e: { key: string; })=> {
		if (e.key === 'Enter') {
			setEditable(false);
		} else if (e.key === 'Esc') {// esc키를 누르면 저장 취소되어 그 전 텍스트를 불러온다
			setEditable(false);
			setText(previousText);
			setPText('');
		}
	};
	async function onRemove() {
		await memoDTO.deleteMemo(memo['memoId']);
		onRefresh();
	}

	async function onChangeValue() {
		memo['memoValue'] = text;
		await memoDTO.updateMemo(memo);
	}

	return (
		<>
			{editable ? (
				<div className="editableBox">
					<input type="text" value={text} onChange={
						(e) => handleChange(e)} onKeyDown={handleKeyDown} />
					<button className="btn btn-dark" onClick={editSave}>save</button>
					<button className="btn" onClick={onRemove}> remove </button>
				</div>
			) : (
				<div className="noneditableBox">
					<span>{text}</span>
					<button className="btn btn-sunflower" onClick={editOn}>edit</button>
					<button className="btn" onClick={onRemove}> remove </button>
				</div>
			)}
		</>
	);
}

export default CalendarEditableBox;
