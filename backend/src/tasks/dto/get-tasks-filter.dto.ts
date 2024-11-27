import { TaskStatus } from '../task-status.enum';
import { IsOptional, IsEnum } from 'class-validator';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  search?: string;
}
