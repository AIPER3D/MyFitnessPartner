import { VideoDAO } from './';

interface RoutineDAO {
    id: number;
    name: string;
    videos: Array<VideoDAO>;
}

export type { RoutineDAO };
