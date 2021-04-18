import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { RxDatabase } from 'rxdb';

type props = {
    db: RxDatabase
}

const Wrapper = styled.div``;

function Exercise({ db }: props) {
	const [isPlaying, setPlaying] = useState(false);

	const HEIGHT = 500;
	const WIDTH = 500;

	return (
		<Wrapper>
            =
		</Wrapper>
	);
}

export default Exercise;
