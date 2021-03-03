import React, { useState } from 'react';
import './board.css';

import Gallery from './gallery';

type BoardProps = {
    type: string;
};

type Content = {
    id: number;
    title: string;
}

function Board({ type }: BoardProps) {
    const [content, setContent] = useState<Content>({id: 0, title: ''});

    return (
        <div>
            { content }
        </div>
    );
}

Board.defaultProps = {

};

export default Board;