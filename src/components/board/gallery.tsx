import React from 'react';
import './gallery.css';

type GalleryProps = {
    id: number;
    title: string;
};

function Gallery({ id, title }: GalleryProps) {
    return (
        <div>
            abcdefg
            <div>
                <button>시작하기</button>
                <button>포기하기</button>
            </div>
    </div>
    );
}

Gallery.defaultProps = {

};

export default Gallery;