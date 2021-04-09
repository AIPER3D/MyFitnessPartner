import React, { useState } from 'react';
import './CalendarEditableBox.scss';

type Props = {
    init: string;
    // onRemove: () => void;
}

function CalendarEditableBox({ init } : Props) {
	const [text, setText] = useState<string>(init);
	const [previousText, setPText] = useState<string>('');
	const [editable, setEditable] = useState(false);
	const editOn = () => {
		setPText(text);
		setEditable(true);
	};
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setText(e.target.value);
	};
	const editSave = () => {
		setEditable(false);
		// 여기에 db로 연동해서 추가 입력한 메모를 저장함
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

	return (
		<>
			{editable ? (
				<div className="editableBox">
					<input type="text" value={text} onChange={
						(e) => handleChange(e)} onKeyDown={handleKeyDown} />
					<button className="btn btn-dark" onClick={editSave}>save</button>
				</div>
			) : (
				<div className="noneditableBox">
					<span>{text}</span>
					<button className="btn btn-sunflower" onClick={editOn}>edit</button>
				</div>
			)}
		</>
	);
}

export default CalendarEditableBox;
