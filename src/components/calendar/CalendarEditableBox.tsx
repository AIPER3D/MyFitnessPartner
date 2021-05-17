import React, { useState, useEffect } from 'react';
import './CalendarEditableBox.scss';
import { RxDatabase } from 'rxdb';
import { MemoDTO } from '../../db/DTO/memoDTO';
import { MemoDAO } from '../../db/DAO/memoDAO';
import { ThemeConsumer } from 'styled-components';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
		isEmpty();
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

		if (text === '') {
			setText('Memo');
		}
		onChangeValue();
		onRefresh();
	};
	const handleKeyDown = (e: { key: string; })=> {
		if (e.key === 'Enter') {
			editSave();
		} else if (e.key === 'Escape') {// esc키를 누르면 저장 취소되어 그 전 텍스트를 불러온다
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

	function inputTypeCheck() {
		if (memo['memoType'] === 'memo') {
			return true;
		} else if (memo['memoType'] === 'calory') {
			return false;
		}
	}

	async function onChangeType() {
		if (memo['memoType'] === 'memo') {
			memo['memoType'] = 'calory';
		} else if (memo['memoType'] === 'calory') {
			memo['memoType'] = 'memo';
		}
		await memoDTO.updateMemo(memo).then(onRefresh);
	}

	const handleType = (e: any) => {
		e.stopPropagation();
		onChangeType();
	};

	const isEmpty = () => {
		if (text === '') {
			setEditable(true);
		} else {
			setEditable(false);
		}
	};

	return (
		<>
			{editable ? (
				<div className="editableBox">
					<label className="inputBox">
						<input value={text} onChange={
							(e) => handleChange(e)} onKeyDown={handleKeyDown} required/>
						{
							inputTypeCheck() ? (
								<div className="typeBar">
									<span className="input_label selected">Plain</span>
									<span className="input_label nonselected"
										onClick={(e) => handleType(e)}>Calory</span>
								</div>
							) : (
								<div className="typeBar">
									<span className="input_label nonselected"
										onClick={handleType}>Plain</span>
									<span className="input_label selected">Calory</span>
								</div>
							)}
					</label>
					<FontAwesomeIcon className="save_button" icon={ faSave } size={'2x'}
						color={'#415b79'} onClick={editSave}/>
					<span className="remove_button" onClick={onRemove}> &times; </span>
				</div>
			) : (
				<div className="noneditableBox">
					<span className="check"> </span>
					{
						inputTypeCheck() ? (
							<span onClick={editOn}>{text}</span>
						) : (
							<span onClick={editOn}>{text + '  kcal'}</span>
						)}
					<span className="remove_button" onClick={onRemove}> x </span>
				</div>
			)}
		</>
	);
}

export default CalendarEditableBox;
