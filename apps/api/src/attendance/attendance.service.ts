import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AttendanceStatus } from '@educare/database';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async getBatchStudents(batchId?: string) {
    let students;
    if (batchId && batchId !== 'ALL') {
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
      students = enrollments.map(e => e.studentProfile);
    } else {
      students = await this.prisma.studentProfile.findMany({
        include: {
          user: { select: { firstName: true, lastName: true, id: true } }
        }
      });
    }

    return students.map(s => ({
      studentId: s.id,
      name: `${s.user.firstName} ${s.user.lastName}`,
      admissionNo: s.admissionNo
    }));
  }

  async getAttendanceForBatchAndDate(batchId: string | undefined, date: string) {
    const targetDate = new Date(date);
    
    return this.prisma.attendance.findFirst({
      where: {
        batchId: (batchId && batchId !== 'ALL') ? batchId : null,
        date: targetDate
      },
      include: {
        records: true,
        recordedBy: { select: { firstName: true, lastName: true } }
      }
    });
  }

  async resolveBatchId(centreId: string, boardId: string, standardId: string, track: string) {
    let batch = await this.prisma.batch.findFirst({
      where: { centreId, boardId, standardId, track: track as any }
    });
    if (!batch) {
      // Create a default batch for these dimensions so we can link attendance to it
      // Find any active academic year
      const ay = await this.prisma.academicYear.findFirst({ where: { isActive: true } }) || await this.prisma.academicYear.findFirst();
      if (!ay) throw new BadRequestException("No academic year found");
      
      batch = await this.prisma.batch.create({
        data: {
          name: `Default Batch - ${track}`,
          academicYearId: ay.id,
          boardId,
          standardId,
          centreId,
          track: track as any
        }
      });
    }
    return batch.id;
  }

  async getBatches(centreId: string, boardId: string, standardId: string, track: string) {
    return this.prisma.batch.findMany({
      where: { centreId, boardId, standardId, track: track as any }
    });
  }

  async getStudentsByFilter(centreId: string, boardId: string, standardId: string, track: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        batch: { centreId, boardId, standardId, track: track as any }
      },
      include: {
        studentProfile: {
          include: { user: { select: { firstName: true, lastName: true, id: true } } }
        }
      }
    });

    return enrollments.map(e => ({
      studentId: e.studentProfileId,
      name: `${e.studentProfile.user.firstName} ${e.studentProfile.user.lastName}`,
      admissionNo: e.studentProfile.admissionNo
    }));
  }

  async getAttendanceByFilter(centreId: string, boardId: string, standardId: string, track: string, date: string) {
    const targetDate = new Date(date);
    const batch = await this.prisma.batch.findFirst({
      where: { centreId, boardId, standardId, track: track as any }
    });
    
    if (!batch) return null;

    return this.prisma.attendance.findFirst({
      where: { batchId: batch.id, date: targetDate },
      include: {
        records: true,
        recordedBy: { select: { firstName: true, lastName: true } }
      }
    });
  }

  async markAttendance(data: any, userId: string) {
    const { batchId, date, records, centreId, boardId, standardId, track } = data;
    const targetDate = new Date(date);
    
    let resolvedBatchId = batchId;
    if (batchId === 'ALL') {
      resolvedBatchId = null;
    } else if (!batchId && centreId && boardId && standardId && track) {
      resolvedBatchId = await this.resolveBatchId(centreId, boardId, standardId, track);
    }

    let attendance = await this.prisma.attendance.findFirst({
      where: { batchId: resolvedBatchId, date: targetDate }
    });

    if (attendance) {
      attendance = await this.prisma.attendance.update({
        where: { id: attendance.id },
        data: { recordedById: userId }
      });
    } else {
      attendance = await this.prisma.attendance.create({
        data: {
          batchId: resolvedBatchId,
          date: targetDate,
          recordedById: userId
        }
      });
    }

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
