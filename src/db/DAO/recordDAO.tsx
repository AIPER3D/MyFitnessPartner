interface RecordDAO {
    id: number;
    time: number;
    startTime: number;
    routineId: number;
    routineName: string;
    recordExercise: Array<{name: string, startTime: Number, endTime: Number, count: Number}>;
}

export type { RecordDAO };
