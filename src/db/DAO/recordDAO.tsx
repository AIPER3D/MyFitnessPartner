interface RecordDAO {
    id: number;
    playTime: number;
    createTime: number;
    routineId: number;
    routineName: string;
    recordExercise: Array<{name: string, startTime: number, endTime: number, count: number}>;
}

export type { RecordDAO };
