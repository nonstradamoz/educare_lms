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
}
