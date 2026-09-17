import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class FeeService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.feeRecord.findMany({
      include: {
        student: {
          include: {
            user: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });
  }

  async create(data: any) {
    return this.prisma.feeRecord.create({
      data: {
        receiptNo: `FEE-${Date.now()}`,
        studentId: data.studentId,
        amount: Number(data.amount),
        status: data.status || 'PAID',
        paymentMode: data.paymentMode,
        feeHead: data.feeHead
      }
    });
  }
}
