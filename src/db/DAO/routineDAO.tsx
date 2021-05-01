import { VideoDAO } from './';

interface RoutineDAO {
    id: number;
    name: string;
    videos: Array<number>;
}

export type { RoutineDAO };
