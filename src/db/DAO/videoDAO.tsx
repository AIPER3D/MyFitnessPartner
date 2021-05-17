interface VideoDAO {
    id: number;
    name: string;
    timeline: { name: string, start: number, end: number }[];
}

export type { VideoDAO };
