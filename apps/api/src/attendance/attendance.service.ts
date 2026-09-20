import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AttendanceStatus } from '@educare/database';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async getBatchStudents(batchId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { batchId },
      include: {
        studentProfile: {
          include: {
            user: { select: { firstName: true, lastName: true, id: true } }
          }
        }
      }
    });

    return enrollments.map(e => ({
      studentId: e.studentProfileId,
      name: `${e.studentProfile.user.firstName} ${e.studentProfile.user.lastName}`,
      admissionNo: e.studentProfile.admissionNo
    }));
  }

  async getAttendanceForBatchAndDate(batchId: string, date: string) {
    const targetDate = new Date(date);
    
    return this.prisma.attendance.findUnique({
      where: {
        batchId_date: {
          batchId,
          date: targetDate
        }
      },
      include: {
        records: true,
        recordedBy: { select: { firstName: true, lastName: true } }
      }
    });
  }

  async markAttendance(data: any, userId: string) {
    const { batchId, date, records } = data;
    const targetDate = new Date(date);

    // Upsert the Attendance parent record
    const attendance = await this.prisma.attendance.upsert({
      where: {
        batchId_date: { batchId, date: targetDate }
      },
      create: {
        batchId,
        date: targetDate,
        recordedById: userId
      },
      update: {
        recordedById: userId // Update who last modified it
      }
    });

    // We can just delete the old records and insert new ones to handle upsert cleanly
    await this.prisma.attendanceRecord.deleteMany({
      where: { attendanceId: attendance.id }
    });

    const createRecords = records.map((r: any) => ({
      attendanceId: attendance.id,
      studentId: r.studentId,
      status: r.status as AttendanceStatus,
      remarks: r.remarks
    }));

    await this.prisma.attendanceRecord.createMany({
      data: createRecords
    });

    return { message: "Attendance marked successfully" };
  }
}
