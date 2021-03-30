import React from 'react';
import styled from 'styled-components';

type PaginationProps = {
    count: number;
};

const color = {
	'd': '#2C363F',
	'p': '#E75A7C',
	'w': '#F2F5EA',
	'b': '#48ACF0',
};

const Box = styled.ul`
	display: block;
	padding: 0px 0px 0px 0px;
	margin: 0px 0px 00px 0px;
	
	font-size: 12pt;
	text-align: center;
	overflow: auto;
`;

const Page = styled.li`
	display: inline-block;
	width: 40px;
	padding: 10px 0px 10px 0px;
	margin: 0px 0px 0px 0px;
	border: 1px solid #dddddd;
	border-right: ${(props) => props.value == 'r' ? 1 : 0 || 0 }px solid #ddd;
	background: ${(props) => props.color == 'b' ? color['b'] : '#fff' || '#fff' };
	
	list-style: none;
	text-align: center;
	cursor: pointer;
	
	&:hover {
		filter: brightness(90%);
		cursor: pointer;
	}
`;

function Pagination({ count }: PaginationProps) {
	return (
		<Box>
			<Page color={'b'}> ◀ </Page>
			<Page> 1 </Page>
			<Page color={'b'}> 2 </Page>
			<Page> 3 </Page>
			<Page color={'b'} value={'r'}> ▶ </Page>
		</Box>
	);
}

Pagination.defaultProps = {

};

export default Pagination;
