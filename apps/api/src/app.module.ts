import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { CentresModule } from './centres/centres.module';
import { DatabaseModule } from './database/database.module';
import { StudentsModule } from './students/students.module';
import { StaffModule } from './staff/staff.module';
import { SetupModule } from './setup/setup.module';
import { ExamsModule } from './exams/exams.module';
import { CloudflareModule } from './cloudflare/cloudflare.module';
import { EstudyModule } from './estudy/estudy.module';
import { LiveClassModule } from './live-class/live-class.module';
import { StudyMaterialModule } from './study-materials/study-materials.module';
import { FeeModule } from './fee/fee.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { SyllabusModule } from './syllabus/syllabus.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    CentresModule,
    StudentsModule,
    StaffModule,
    SetupModule,
    ExamsModule,
    CloudflareModule,
    EstudyModule,
    LiveClassModule,
    StudyMaterialModule,
    FeeModule,
    AssignmentsModule,
    SyllabusModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
