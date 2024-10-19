import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { dataSourceOptions } from './database/ormconfig'
import { ProjectsModule } from './projects/projects.module'
import { TasksModule } from './tasks/tasks.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { ChecklistsModule } from './checklists/checklists.module';
import { ChecklistItemsModule } from './checklist-items/checklist-items.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UsersModule,
    ProjectsModule,
    TasksModule,
    ChecklistsModule,
    ChecklistItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
