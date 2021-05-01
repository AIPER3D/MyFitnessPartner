import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

type PaginationProps = {
	current: number;
    max: number;
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
	border-right: ${(props) => props.value == 'last' ? 1 : 0 || 0 }px solid #ddd;
	background: ${(props) => props.color == 'active' ? color['d'] : '#fff' || '#fff' };
	color: ${(props) => props.color == 'active' ? '#fff' : color['d'] || color['d'] };
	
	list-style: none;
	text-align: center;
	cursor: pointer;
	
	&:hover {
		filter: brightness(90%);
		cursor: pointer;
	}
`;

const Empty = styled.li`
	display: inline-block;
	width: 0px;
	padding: 0px;
	margin: 0px;
`;

function Pagination({ current, max }: PaginationProps) {
	return (
		<Box>
			<Link to={ './' + Number(1) }><Page value={'first'}>
				<b>&laquo;</b></Page>
			</Link>
			{ current - 2 >= 1 ?
				(
					<Link to={ './' + Number(current - 2) }><Page>{ current - 2 }</Page></Link>
				) : (<Empty />)
			}
			{ current - 1 >= 1 ?
				(
					<Link to={ './' + Number(current - 1) }><Page>{ current - 1 }</Page></Link>
				) : (<Empty />)
			}
			<Page color={'active'}> { current } </Page>
			{ current + 1 <= max ?
				(
					<Link to={ './' + Number(current + 1) }><Page>{ current + 1 }</Page></Link>
				) : (<Empty />)
			}
			{ current + 2 <= max ?
				(
					<Link to={ './' + Number(current + 2) }><Page>{ current + 2 }</Page></Link>
				) : (<Empty />)
			}
			<Link to={ './' + Number(max) }>
				<Page value={'last'}><b>&raquo;</b></Page>
			</Link>
		</Box>
	);
}

Pagination.defaultProps = {

};

export default Pagination;
