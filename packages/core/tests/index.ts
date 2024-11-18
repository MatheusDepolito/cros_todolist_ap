import { faker } from '@faker-js/faker';
import { TaskFactory, KnexServiceFactory } from '@cros_todolist/tests';
import {
  Task,
  User,
  KnexService,
  ITasksRepository,
  IUsersRepository,
  KnexTasksRepository,
  KnexUsersRepository,
  KnexCommonMigrationsService,
} from '@cros_todolist/core';

export const initTestingForRepositories = async () => {
  const knexService = KnexServiceFactory.create().build();

  const knexCommonMigrationsService = new KnexCommonMigrationsService(knexService);

  await knexCommonMigrationsService.up();

  const common = await initModelsToCommon({ knexService });

  const data: InitTestingForRepositoriesOutputDTO = {
    common,
    knexService,
  };

  return data;
};

export type InitTestingForRepositoriesOutputDTO = {
  common: InitModelsToCommonOutputDTO;
  knexService: KnexService;
};

const initModelsToCommon = async (inputs: InitModelsToCommonInputDTO) => {
  const { knexService } = inputs;

  const tasksRepository: ITasksRepository = new KnexTasksRepository(knexService);

  const userRepository: IUsersRepository = new KnexUsersRepository(knexService);

  const user = await User.create({
    email: 'test1@gmail.com',
    password: '123',
    username: 'test1',
  });

  await userRepository.create({ user });

  const tasks = await TaskFactory.model.load().withUserId(user.id).build();

  await tasksRepository.create({ task: tasks });

  const data: InitModelsToCommonOutputDTO = {
    tasks,
    user,
  };

  return data;
};

export type InitModelsToCommonInputDTO = {
  knexService: KnexService;
};

export type InitModelsToCommonOutputDTO = {
  tasks: Task;
  user: User;
};
