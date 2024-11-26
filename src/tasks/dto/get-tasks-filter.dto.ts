import { TaskStatus } from '../task.model';
import { IsOptional, IsEnum } from 'class-validator';

export class getTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  search?: string;
}
