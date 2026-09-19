import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { SyllabusConfiguration } from '@educare/database';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getConfiguration(): Promise<SyllabusConfiguration> {
    let config = await this.prisma.syllabusConfiguration.findFirst();
    if (!config) {
      config = await this.prisma.syllabusConfiguration.create({ data: {} });
    }
    return config;
  }

  async recalculateTopicProgress(studentId: string, topicId: string, batchId: string) {
    const config = await this.getConfiguration();
    
    const progress = await this.prisma.studentTopicProgress.findUnique({
      where: { studentId_topicId_batchId: { studentId, topicId, batchId } }
    });

    if (!progress) return;

    // 1. Calculate Completion Percentage
    let completion = 0;
    completion += progress.lectureProgress * config.lectureWeight;
    completion += progress.materialProgress * config.materialWeight;
    completion += progress.practiceProgress * config.practiceWeight;
    completion += progress.testProgress * config.testWeight;

    // Cap at 100
    completion = Math.min(100, completion);

    // 2. Calculate Status
    let status = progress.status;

    // Mastery Condition Check
    const isMastered = 
      completion >= config.masteryCompletionThreshold &&
      progress.practiceAccuracy >= config.masteryAccuracyThreshold &&
      progress.latestTestScore >= config.masteryTestScoreThreshold &&
      progress.questionsAttempted >= config.masteryMinQuestions;

    // Weak / Revision Required Check
    const isWeak = 
      (progress.questionsAttempted > 0 && progress.practiceAccuracy < config.weakPracticeThreshold) ||
      (progress.testsAttempted > 0 && progress.latestTestScore < config.weakTestThreshold);

    if (isMastered) {
      status = 'MASTERED';
    } else if (isWeak || status === 'REVISION_REQUIRED') {
      status = 'REVISION_REQUIRED'; // Can also be triggered explicitly by revision engine
    } else if (completion >= config.completedThreshold) {
      status = 'COMPLETED';
    } else if (completion >= config.inProgressThreshold) {
      status = 'IN_PROGRESS';
    } else {
      status = 'NOT_STARTED';
    }

    // 3. Update Record
    await this.prisma.studentTopicProgress.update({
      where: { id: progress.id },
      data: {
        completionPercentage: completion,
        status: status,
        completedAt: (status === 'COMPLETED' || status === 'MASTERED') && !progress.completedAt ? new Date() : progress.completedAt
      }
    });

    return status;
  }
}
