const fs = require('fs');

// Patch estudy.service.ts
let estudyService = fs.readFileSync('apps/api/src/estudy/estudy.service.ts', 'utf8');
estudyService = estudyService.replace(/DatabaseService/g, 'PrismaService');
estudyService = estudyService.replace(/database.service/g, 'prisma.service');
estudyService = estudyService.replace(/databaseService/g, 'prisma');
fs.writeFileSync('apps/api/src/estudy/estudy.service.ts', estudyService);

// Patch estudy.module.ts
let estudyModule = fs.readFileSync('apps/api/src/estudy/estudy.module.ts', 'utf8');
estudyModule = estudyModule.replace(/providers: \[EstudyService\]/, 'providers: [EstudyService, PrismaService]');
estudyModule = estudyModule.replace(/@Module\(\{/, "import { PrismaService } from '../database/prisma.service';\n@Module({");
fs.writeFileSync('apps/api/src/estudy/estudy.module.ts', estudyModule);

// Patch exams.service.ts
let examsService = fs.readFileSync('apps/api/src/exams/exams.service.ts', 'utf8');
examsService = examsService.replace(/async getExams\(\)/g, 'async getExams(): Promise<any>');
examsService = examsService.replace(/async getMcqQuestions\(\)/g, 'async getMcqQuestions(): Promise<any>');
examsService = examsService.replace(/async createMcqQuestion\(data: any\)/g, 'async createMcqQuestion(data: any): Promise<any>');
examsService = examsService.replace(/, code:"DB"/g, '');
examsService = examsService.replace(/, code: "SUBJ"/g, '');
fs.writeFileSync('apps/api/src/exams/exams.service.ts', examsService);

// Patch exams.controller.ts
let examsController = fs.readFileSync('apps/api/src/exams/exams.controller.ts', 'utf8');
examsController = examsController.replace(/getExams\(\)/g, 'getExams(): Promise<any>');
examsController = examsController.replace(/getMcqQuestions\(\)/g, 'getMcqQuestions(): Promise<any>');
examsController = examsController.replace(/createMcqQuestion\(@Body\(\) data: any\)/g, 'createMcqQuestion(@Body() data: any): Promise<any>');
fs.writeFileSync('apps/api/src/exams/exams.controller.ts', examsController);
