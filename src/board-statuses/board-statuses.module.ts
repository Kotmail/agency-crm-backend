import { Module } from '@nestjs/common'
import { BoardStatusesService } from './board-statuses.service'
import { BoardStatusesController } from './board-statuses.controller'
import { BoardStatus } from './board-status.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([BoardStatus])],
  controllers: [BoardStatusesController],
  providers: [BoardStatusesService],
})
export class BoardStatusesModule {}
