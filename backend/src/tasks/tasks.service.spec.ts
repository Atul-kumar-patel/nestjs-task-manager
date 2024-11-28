import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './task.repository';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  username: 'atul',
  id: 'asadsfyhmk',
  password: 'atulll',
  tasks: [],
};
describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();
    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('somevalue');
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('somevalue');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      const mockTask = {
        id: 'someId',
        title: 'Test task',
        description: 'Test description',
        status: 'OPEN',
        user: mockUser,
      };
      tasksRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById('someId', mockUser);

      expect(tasksRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 'someId',
          user: mockUser,
        },
      });
      expect(result).toEqual(mockTask);
    });

    it('throws error if task is not found', async () => {
      tasksRepository.findOne.mockResolvedValue(null);

      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow();
    });
  });
});
