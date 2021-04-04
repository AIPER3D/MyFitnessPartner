import { VideoDAO } from './';

interface RoutineDAO {
    routineId: number;
    routineName: string;
    videos: Array<VideoDAO | null>;
}

export type { RoutineDAO };
