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


/* 구현자 : 김인환
이 컴포넌트는 모달에 표시될 각 날짜의 메모 기록을 바탕으로 한 컴포넌트이다. 클릭으로 수정 상태에 진입하고, 엔터 혹은 저장버튼(아이콘으로 명확하게 보여줌)을 통해 변경한 메모를 저장한다.
Esc 버튼으로 메모의 변경을 취소할 수 있다.
메모는 일반(Plain) 텍스트와 칼로리 텍스트가 존재한다. 칼로리 텍스트는 뒤에 kcal 단위가 나오게 된다.
지식의 한계로 입력되지 않은 상태에서 인풋 창 안에 존재하는 메모 칼로리 버튼이 눌러지지 않는다. 텍스트를 입력하고 바꿀 수 있음.
*/

function CalendarEditableBox({ memo, onRefresh, db } : Props) {
	const [text, setText] = useState<string>(memo['memoValue']); // 변경중인 텍스트. 실시간 반영을 위해 useState 사용
	const [previousText, setPText] = useState<string>(''); // 변경되기 전 텍스트를 저장
	const [editable, setEditable] = useState(false); // 사용자가 수정 시도를 하는지에 대한 옵션
	const [memoDTO, setMemoDTO] = useState<MemoDTO>(new MemoDTO()); // 메모를 RxDB에서 불러오는 DTO이다.
	useEffect(()=>{
		memoDTO.setDB(db);
		isEmpty();
	}, [db]);
	const editOn = () => { // 마우스로 클릭하여 수정을 시도하였을 때 실행되는 함수이다.
		setPText(text); // 수정 전 텍스트를 미리 previousText에 저장한다.
		setEditable(true); // 수정 가능한 상태로 상태를 변경한다.
	};
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { // input에 입력될 때 실시간으로 바뀌도록 해주는 함수이다.
		setText(e.target.value);
	};
	const editSave = () => { // 변경한 텍스트를 저장하는 함수이다.
		setEditable(false);

		if (text === '') { // 아무 정보도 없이 저장할 경우 삭제 말고는 가능하지 않아 PlaceHolder를 넣었음.
			setText('Memo');
		}
		onChangeValue();
		onRefresh(); // 변경한 정보가 모달창에 제대로 나올 수 있게끔 Modal 안에 존재하는 refresh 변수를 변경하여 state 변경으로 화면이 refresh 되게 한다.
	};
	const handleKeyDown = (e: { key: string; })=> { // 수정 후 엔터나 Esc키 (통상적으로 입력 종료를 의미하는 키들)에 대한 동작을 추가하였음.
		if (e.key === 'Enter') {
			editSave();
		} else if (e.key === 'Escape') {// esc키를 누르면 저장 취소되어 그 전 텍스트를 불러온다
			setEditable(false);
			setText(previousText);
			setPText('');
		}
	};

	// 수정 상태 중에서 제거 버튼을 눌렀을 때 작동하는 함수이다.
	async function onRemove() {
		await memoDTO.deleteMemo(memo['memoId']);
		onRefresh();
	}


	// 이 함수에서는 이미 존재하는 memo 객체에 변경한 정보를 담아 DTO로 전달하여 업데이트를 진행한다.
	async function onChangeValue() {
		memo['memoValue'] = text; // 이런 식으로 변경한 정보만 반영하여 객체 그대로 전달한다.
		await memoDTO.updateMemo(memo);
	}


	// 현재 메모가 일반 텍스트인지 칼로리 텍스트인지 구분하는 함수이다.
	function inputTypeCheck() {
		if (memo['memoType'] === 'memo') {
			return true;
		} else if (memo['memoType'] === 'calory') {
			return false;
		}
	}

	// 현재 두 가지의 메모 타입만 존재하기에 토글 식으로 구현하였다.
	async function onChangeType() {
		if (memo['memoType'] === 'memo') {
			memo['memoType'] = 'calory';
		} else if (memo['memoType'] === 'calory') {
			memo['memoType'] = 'memo';
		}
		await memoDTO.updateMemo(memo).then(onRefresh);
	}
	// Plain 혹은 Calory 버튼을 클릭하였을 때 1차적으로 실행되는 함수이다.
	const handleType = (e: any) => {
		e.stopPropagation();
		onChangeType();
	};

	// 처음 생성하거나 하여 텍스트가 없을 때에 바로 생성되게끔 하지 않으면 수정을 시도할 수가 없다.(클릭을 해야 수정 가능하기 때문) 그래서 비어있는 경우에 바로 수정 상태로 되게 하였음.
	const isEmpty = () => {
		if (text === '') {
			setEditable(true);
		} else {
			setEditable(false);
		}
	};


	return (
		<>
			{editable ? ( // 현재 수정 상태인지 유무를 확인하여 보여지는 것을 달리 하는 부분.
				<div className="editableBox">
					<label className="inputBox">
						<input value={text} onChange={
							(e) => handleChange(e)} onKeyDown={handleKeyDown} required/>
						{
							inputTypeCheck() ? ( // 현재 어떠한 메모 타입인지 여부로 표시 형식을 바꾼다.
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
