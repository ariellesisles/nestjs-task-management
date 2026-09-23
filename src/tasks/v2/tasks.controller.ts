import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '../task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskStatus } from '../task-status.enum';
import { GetTasksFilterDto } from '../dto/get-tasks-filter.dto';
import { DebugJwtAuthGuard } from '../../auth/jwt-debug.strategy';
import { GetUser } from '../../auth/get-user.decorator';
import { User } from '../../auth/user.entity';
import { Logger } from '@nestjs/common';

@Controller({ path: 'tasks', version: '2' })
@UseGuards(DebugJwtAuthGuard)
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" calls getTasks. Filter ${JSON.stringify(filterDto)}`,
    );
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get(':id')
  getTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Task> | undefined {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" calls createTask. Task Details: ${JSON.stringify(createTaskDto)}`,
    );

    return this.tasksService.createTask(createTaskDto, user);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
    @GetUser() user: User,
  ) {
    return this.tasksService.updateTask(id, status, user);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }
}
