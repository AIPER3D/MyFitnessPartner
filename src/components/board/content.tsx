import React from 'react';

type Content = {
    id: number;
    title: string;
    desc?: string;
    thumbnail?: string;

    onClick?: (id: number) => void;
}

export type { Content };
