import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { EnquiryStatus } from '@educare/database';

@Injectable()
export class EnquiryService {
  constructor(private prisma: PrismaService) {}

  async createEnquiry(data: any) {
    return this.prisma.enquiry.create({
      data,
    });
  }

  async getAllEnquiries() {
    return this.prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        assignedTo: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async getEnquirySummary() {
    const total = await this.prisma.enquiry.count();
    
    // Get beginning of current month
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const thisMonth = await this.prisma.enquiry.count({
      where: {
        createdAt: { gte: firstDay }
      }
    });
    
    const converted = await this.prisma.enquiry.count({
      where: { status: EnquiryStatus.CONVERTED }
    });

    return { total, thisMonth, converted };
  }

  async updateEnquiry(id: string, data: any) {
    const enquiry = await this.prisma.enquiry.findUnique({ where: { id } });
    if (!enquiry) throw new NotFoundException('Enquiry not found');

    return this.prisma.enquiry.update({
      where: { id },
      data,
    });
  }
}
