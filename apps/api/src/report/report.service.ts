import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType, EnquiryStatus, AttendanceStatus } from '@prisma/client';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async getFeeCollectionReport(startDate: string, endDate: string) {
    const from = new Date(startDate);
    const to = new Date(endDate);
    
    return this.prisma.feeRecord.findMany({
      where: {
        date: { gte: from, lte: to }
      },
      include: {
        student: {
          include: { user: { select: { firstName: true, lastName: true } } }
        }
      },
      orderBy: { date: 'desc' }
    });
  }

  async getExpenseIncomeReport(startDate: string, endDate: string) {
    const from = new Date(startDate);
    const to = new Date(endDate);
    
    const transactions = await this.prisma.transaction.findMany({
      where: { date: { gte: from, lte: to } },
      orderBy: { date: 'desc' },
      include: { recordedBy: { select: { firstName: true, lastName: true } } }
    });

    const feeRecords = await this.prisma.feeRecord.findMany({
      where: { status: 'PAID', date: { gte: from, lte: to } }
    });

    return {
      transactions,
      feeTotal: feeRecords.reduce((sum, f) => sum + f.amount, 0)
    };
  }

  async getEnquiryConversionReport(startDate: string, endDate: string) {
    const from = new Date(startDate);
    const to = new Date(endDate);
    
    const all = await this.prisma.enquiry.findMany({
      where: { createdAt: { gte: from, lte: to } }
    });

    const statusCounts = {
      NEW: 0, CONTACTED: 0, VISITED: 0, QUALIFIED: 0, CONVERTED: 0, LOST: 0
    };

    all.forEach(e => {
      statusCounts[e.status]++;
    });

    return {
      total: all.length,
      counts: statusCounts,
      conversionRate: all.length > 0 ? (statusCounts.CONVERTED / all.length) * 100 : 0
    };
  }

  async getStudentPerformanceReport(batchId: string) {
    // 1. Get students in batch
    const enrollments = await this.prisma.enrollment.findMany({
      where: { batchId },
      include: {
        studentProfile: {
          include: { user: { select: { firstName: true, lastName: true } } }
        }
      }
    });

    const students = enrollments.map(e => e.studentProfile);
    const studentIds = students.map(s => s.id);

    // 2. Get attendance aggregates
    const attRecords = await this.prisma.attendanceRecord.findMany({
      where: { studentId: { in: studentIds } },
      include: { attendance: { select: { batchId: true } } }
    });

    // 3. Map aggregates back to students
    return students.map(student => {
      const studentAtts = attRecords.filter(r => r.studentId === student.id && r.attendance.batchId === batchId);
      const totalDays = studentAtts.length;
      const presentDays = studentAtts.filter(a => a.status === AttendanceStatus.PRESENT || a.status === AttendanceStatus.LATE).length;
      const attPercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

      return {
        studentId: student.id,
        name: `${student.user.firstName} ${student.user.lastName}`,
        admissionNo: student.admissionNo,
        attendanceDetails: {
          totalDays,
          presentDays,
          percentage: attPercentage.toFixed(1)
        }
      };
    });
  }
}
