import { Knex } from "knex";
import { KnexService } from "../../../../shared/database/infra/knex/knex.service";
import { CountTasksParams, CreateManySubTasksParams, CreateTasksParams, DeleteTasksParams, ExclusiveTasksParams, ExistsTasksParams, FindManyTasksParams, FindOneTasksParams, ITasksRepository, UpdateManySubTaskParams, UpdateTasksParams } from "../../application/tasks.repository";
import { Task } from "../../domain/task.model";
import { TaskEntity } from "../entities/task-entity";
import { TasksMapper } from "../mappers/tasks.mapper";

export class KnexTasksRepository implements ITasksRepository {
  constructor(private readonly knexService: KnexService) {}

  async findOne(params: FindOneTasksParams): Promise<Task | null> {
    const { id, includes } = params;

    const taskEntity = await this.knexService
      .q<TaskEntity>(`common.tasks`)
      .where({ id })
      .first();

    if(!taskEntity) {
      return null;
    }

    if (includes?.subTasks) {
      taskEntity.subTasks = await this.knexService
        .q<TaskEntity>(`common.tasks`)
        .where({
          parent_task_id: id,
        });

      if(taskEntity.subTasks.length > 0) {
        for (const subTask of taskEntity.subTasks) {
          subTask.subTasks = await this.knexService
            .q<TaskEntity>('common.tasks')
            .where({
              parent_task_id: subTask.id,
          });
        }
      }
    }

    return TasksMapper.toDomain(taskEntity);
  }

  async findMany(params: FindManyTasksParams): Promise<Task[]> {
    const { userId, ...filters } = params;

    let query = this.knexService
      .q<TaskEntity>(`common.tasks`)
      .where('user_id', userId)
      .select('*');

    query = this.#buildWhere({ query, filters });

    const tasksEntities = await query;

    return tasksEntities.map(TasksMapper.toDomain);
  }

  async create(params: CreateTasksParams<Knex.Transaction>): Promise<void> {
    const { task, transaction } = params;

    const query = transaction ?? this.knexService.q;

    await query<TaskEntity>(`common.tasks`).insert({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      user_id: task.userId,
      parent_task_id: task.parentTaskId,
      created_at: task.createdAt,
      updated_at: task.updatedAt,
    });
  }

  async createMany(params: CreateManySubTasksParams<Knex.Transaction>): Promise<void> {
    const { tasks, transaction } = params;

    const query = transaction ?? this.knexService.q;

    await query<TaskEntity>(`common.tasks`).insert(
      tasks.map((tsk) => ({
        id: tsk.id,
        title: tsk.title,
        description: tsk.description,
        status: tsk.status,
        user_id: tsk.userId,
        parent_task_id: tsk.parentTaskId,
        created_at: tsk.createdAt,
        updated_at: tsk.updatedAt,
      })),
    );
  }

  async updateMany(params: UpdateManySubTaskParams<Knex.Transaction>): Promise<void> {
    const { tasks, transaction } = params;
  
    const query = transaction ?? this.knexService.q;
  
    await query.transaction(async (trx) => {
      for (const task of tasks) {
        await trx<TaskEntity>('common.tasks')
          .where({ id: task.id })
          .update({
            title: task.title,
            description: task.description,
            status: task.status,
            updated_at: task.updatedAt,
          });
      }
    });
  }
  async update(params: UpdateTasksParams<Knex.Transaction>): Promise<void> {
    const { task, transaction } = params;

    const query = transaction ?? this.knexService.q;

    await query<TaskEntity>(`common.tasks`)
      .where({ id: task.id })
      .update({
        title: task.title,
        description: task.description,
        status: task.status,
        updated_at: task.updatedAt,
      });
  }

  async delete(params: DeleteTasksParams<Knex.Transaction>): Promise<void> {
    const { task, transaction } = params;

    const query = transaction ?? this.knexService.q;

    await query<TaskEntity>(`common.tasks`)
      .where({ id: task.id })
      .delete();
  }

  async deleteByTaskParentId(params: DeleteTasksParams<Knex.Transaction>): Promise<void> {
    const { task, transaction } = params;

    const query = transaction ?? this.knexService.q;

    await query<TaskEntity>(`common.tasks`)
      .where({ parent_task_id: task.id })
      .delete();
  }

  async count(params: CountTasksParams): Promise<number> {
    const { ...filters } = params;

    let query = this.knexService.q<TaskEntity>(`common.tasks`);

    query = this.#buildWhere({ query, filters });

    const counter = await query.count({ count: '*' }).first();

    return Number(counter?.count);
  }

  async exclusive(params: ExclusiveTasksParams): Promise<boolean> {
    const { id, userId, ...filters } = params;

    const query = this.knexService.q<TaskEntity>(`common.tasks`);

    this.#buildWhere({ query, filters });

    const counter = await query.whereNot('id', id).count({ count: '*' }).first();

    return Number(counter?.count) > 0;
  }

  async exists(params: ExistsTasksParams): Promise<boolean> {
    const { userId, id, ...filters } = params;

    let query = this.knexService.q<TaskEntity>(`common.tasks`);

    query = this.#buildWhere({ query, filters });

    const counter = await query.count({ count: '*' }).first();

    return Number(counter?.count) > 0;
  }

  #buildWhere({ query, filters }: BuildWhereParams) {
    const { title, description, status, parentTaskId } = filters;

    if(title !== undefined) {
      query = query.where('title', title);
    }

    if(description !== undefined) {
      query = query.where('description', description);
    }

    if(parentTaskId !== undefined) {
      query = query.where('parent_task_id', parentTaskId);
    }

    if(status !== undefined) {
      query = query.where('status', status);
    }

    return query;
  }
}

type BuildWhereParams = {
  query: Knex.QueryBuilder;
  filters: {
    title?: string;
    description?: string;
    parentTaskId?: string;
    status?: string;
  }
}