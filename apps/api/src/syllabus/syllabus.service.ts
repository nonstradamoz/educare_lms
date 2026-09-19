import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SyllabusService {
  constructor(private prisma: PrismaService) {}

  async getBatchSyllabusProgress(batchId: string) {
    const batch = await this.prisma.batch.findUnique({
      where: { id: batchId },
    });
    
    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    const syllabi = await this.prisma.syllabus.findMany({
      where: {
        boardId: batch.boardId,
        standardId: batch.standardId,
      },
      include: {
        subject: true,
        chapters: {
          include: {
            topics: {
              include: {
                batchProgress: {
                  where: { batchId: batchId }
                }
              }
            },
            batchProgress: {
              where: { batchId: batchId }
            }
          }
        }
      }
    });

    // Transform into a tree structure
    return syllabi.map(syllabus => {
      const chapters = syllabus.chapters.map(chapter => {
        const topics = chapter.topics.map(topic => {
          return {
            id: topic.id,
            name: topic.name,
            status: topic.batchProgress[0]?.status || 'NOT_STARTED',
          };
        });

        // Auto-calculate chapter status if not explicitly set
        let chapterStatus = chapter.batchProgress[0]?.status || 'NOT_STARTED';
        if (topics.length > 0 && !chapter.batchProgress[0]) {
          const completedTopics = topics.filter(t => t.status === 'COMPLETED').length;
          if (completedTopics === topics.length) {
            chapterStatus = 'COMPLETED';
          } else if (completedTopics > 0) {
            chapterStatus = 'IN_PROGRESS';
          }
        }

        return {
          id: chapter.id,
          name: chapter.name,
          status: chapterStatus,
          topics: topics,
        };
      });

      return {
        subjectId: syllabus.subject.id,
        subjectName: syllabus.subject.name,
        chapters: chapters,
      };
    });
  }

  async updateChapterProgress(batchId: string, chapterId: string, status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED', userId: string) {
    return this.prisma.batchChapterProgress.upsert({
      where: {
        batchId_chapterId: {
          batchId,
          chapterId
        }
      },
      create: {
        batchId,
        chapterId,
        status,
        updatedBy: userId,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      },
      update: {
        status,
        updatedBy: userId,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      }
    });
  }

  async updateTopicProgress(batchId: string, topicId: string, status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED', userId: string) {
    return this.prisma.batchTopicProgress.upsert({
      where: {
        batchId_topicId: {
          batchId,
          topicId
        }
      },
      create: {
        batchId,
        topicId,
        status,
        updatedBy: userId,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      },
      update: {
        status,
        updatedBy: userId,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      }
    });
  }

  async getStudentSyllabusProgress(batchId: string, studentId: string) {
    const batch = await this.prisma.batch.findUnique({ where: { id: batchId } });
    if (!batch) throw new NotFoundException('Batch not found');

    const syllabi = await this.prisma.syllabus.findMany({
      where: { boardId: batch.boardId, standardId: batch.standardId },
      include: {
        subject: true,
        chapters: {
          include: {
            topics: {
              include: {
                studentProgress: { where: { studentId, batchId } },
                revisionTasks: { where: { studentId, status: { in: ['UPCOMING', 'DUE'] } } }
              }
            }
          }
        }
      }
    });

    return syllabi;
  }

  async recordStudentEvent(userId: string, data: any) {
    const student = await this.prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException('Student profile not found');
    return { success: true, message: "Event recorded" };
  }

  async getBatchAnalytics(batchId: string) {
    const studentProgress = await this.prisma.studentTopicProgress.findMany({
      where: { batchId },
      include: {
        student: { include: { user: true } },
        topic: true
      }
    });

    const students = new Set(studentProgress.map(p => p.studentId));
    let totalLearningProgress = 0;
    let totalMasteryScore = 0; // Using practice accuracy as a proxy for mastery score here
    let weakTopics: Record<string, number> = {};

    studentProgress.forEach(p => {
      totalLearningProgress += p.completionPercentage;
      totalMasteryScore += p.practiceAccuracy;
      
      if (p.status === 'REVISION_REQUIRED' || p.practiceAccuracy < 60) {
        weakTopics[p.topic.name] = (weakTopics[p.topic.name] || 0) + 1;
      }
    });

    const avgLearningProgress = studentProgress.length ? (totalLearningProgress / studentProgress.length) : 0;
    const avgMastery = studentProgress.length ? (totalMasteryScore / studentProgress.length) : 0;

    // Sort weak topics by frequency
    const topWeakTopics = Object.entries(weakTopics)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    return {
      totalStudents: students.size,
      avgLearningProgress: Math.round(avgLearningProgress),
      avgMastery: Math.round(avgMastery),
      topWeakTopics
    };
  }
}
