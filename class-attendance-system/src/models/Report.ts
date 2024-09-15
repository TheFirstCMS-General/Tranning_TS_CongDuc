// src/models/Report.ts

import { IAttendanceSession } from './AttendanceSession';

export class Report {
    constructor(
        public className: string,
        public dateTime: string,
        public statistics: {
            Present: number;
            Late: number;
            Excused: number;
            Absent: number;
        },
        public studentDetails: { name: string; status: string; note?: string }[]
    ) {}
}

export function generateReport(session: IAttendanceSession): Report {
    const statistics = {
        Present: session.students.filter(s => s.status === 'Present').length,
        Late: session.students.filter(s => s.status === 'Late').length,
        Excused: session.students.filter(s => s.status === 'Excused').length,
        Absent: session.students.filter(s => s.status === 'Absent').length,
    };

    const studentDetails = session.students.map(record => ({
        name: record.studentName,
        status: record.status,
        note: record.note
    }));

    return new Report(session.className, session.dateTime, statistics, studentDetails);
}
