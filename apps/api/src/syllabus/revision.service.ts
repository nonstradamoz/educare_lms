import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class RevisionService {
  constructor(private prisma: PrismaService) {}

  async scheduleNextRevision(studentId: string, topicId: string, currentRevisionScore?: number) {
    const config = await this.prisma.syllabusConfiguration.findFirst();
    const intervals = (config?.revisionIntervalsDays as number[]) || [1, 3, 7, 14, 30];

    // Find latest revision
    const latestRevision = await this.prisma.topicRevisionTask.findFirst({
      where: { studentId, topicId },
      orderBy: { revisionNumber: 'desc' }
    });

    let nextRevisionNumber = 1;
    let daysToAdd = intervals[0];

    if (latestRevision) {
      nextRevisionNumber = latestRevision.revisionNumber + 1;
      
      // If score is bad, repeat same interval or reduce it
      if (currentRevisionScore !== undefined && currentRevisionScore < (config?.weakTestThreshold || 60)) {
        nextRevisionNumber = Math.max(1, latestRevision.revisionNumber - 1);
      }

      // Get interval safely
      const intervalIndex = Math.min(nextRevisionNumber - 1, intervals.length - 1);
      daysToAdd = intervals[intervalIndex];
    }

    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + daysToAdd);

    await this.prisma.topicRevisionTask.create({
      data: {
        studentId,
        topicId,
        revisionNumber: nextRevisionNumber,
        scheduledDate,
        status: 'UPCOMING'
      }
    });
  }

  async checkDueRevisions() {
    // This would ideally be triggered by a Cron job daily
    const now = new Date();
    
    // Mark UPCOMING tasks as DUE if scheduledDate <= now
    await this.prisma.topicRevisionTask.updateMany({
      where: {
        status: 'UPCOMING',
        scheduledDate: { lte: now }
      },
      data: {
        status: 'DUE'
      }
    });

    // We can also trigger ProgressService to mark the Topic as REVISION_REQUIRED
    // However, that requires updating multiple topics. For simplicity, the UI will query DUE tasks directly.
  }
}
