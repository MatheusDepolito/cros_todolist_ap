import { CreateTasksInputDTO, FindManyTasksInputDTO, UpdateTasksInputDTO } from "@cros_todolist/dtos";
import { IUnitOfWorkService } from "../../../shared/database/application/unit-of-work.service";
import { CoreError } from "../../../shared/errors/application/core-error";
import { CoreErrorCode } from "../../../shared/errors/application/core-error-code.enum";
import { Task } from "../domain/task.model";
import { ITasksRepository } from "./tasks.repository";
import { title } from "process";






export class TasksServiceError extends CoreError {} 

export class TasksService {
  constructor(
    private readonly unitOfWork: IUnitOfWorkService,
    private readonly tasksRepository: ITasksRepository,
  ) {}

  async findOne(params: FindOneParams) {
    const { id, includes } = params;

    return await this.tasksRepository.findOne({
      id,
      includes,
    });
  }

  async findOneOrThrow(params: FindOneOrThrowParams) {
    const {} = params;

    const task = await this.findOne(params);

    if(!task) {
      throw new TasksServiceError(
        'task error not found',
        CoreErrorCode.NOT_FOUND,
      );
    }

    return task;
  }

  async findMany(params: FindManyParams) {
    const { userId, filters } = params;

    const tasks = await this.tasksRepository.findMany({
      title: filters?.title,
      status: filters?.status,
      parentTaskId: filters?.parentTaskId,
      userId,
    });

    return {
      tasks
    };
  }

  async create(params: CreateParams) {
    const { createTaskDTO, userId } = params;
    var complementaryTasks: Task[] = [];

    await this.#checkConflicts({
      title: createTaskDTO.title,
      userId,
    });

    const task = Task.create({
      title: createTaskDTO.title,
      description: createTaskDTO.description,
      status: createTaskDTO.status,
      parentTaskId: createTaskDTO.parentTaskId,
      userId
    });

    if(createTaskDTO.subTasks) {

      var subTasks = createTaskDTO.subTasks.map((subTask) => {
        var tsk = Task.create({
          title: subTask.title,
          description: subTask.description,
          status: subTask.status,
          parentTaskId: task.id,
          userId
        });

        if(subTask.subTasks.length > 0) {
          subTask.subTasks.map((t) => {
            const tc = Task.create({
              title: t.title,
              description: t.description,
              parentTaskId: tsk.id,
              status: t.status,
              userId,
            });
            
            complementaryTasks.push(tc);
          });  
        }
        return tsk;  
      });

      
      await this.unitOfWork.transaction(async (transaction) => {
        await this.tasksRepository.create({
          task,
          transaction,
        });

        if(subTasks.length > 0) {
          await this.tasksRepository.createMany({
            tasks: subTasks,
            transaction,
          });   
          
          if(complementaryTasks.length > 0) {
            console.log(complementaryTasks)
            await this.tasksRepository.createMany({
              tasks: complementaryTasks,
              transaction,
            });
          }
        }
      });
    }

    return task;
  }

  async update(params: UpdateParams) {
    const { id, updateTaskDTO, userId } = params;

    // Validação de conflitos (exemplo: título já existente)
    await this.#checkConflicts({
      id,
      title: updateTaskDTO.title,
      userId,
    });

    // Busca a Task principal e lança erro se não encontrada
    const task = await this.findOneOrThrow({ id });

    // Atualiza os dados principais da Task
    task.update({
      title: updateTaskDTO.title,
      description: updateTaskDTO.description,
      status: updateTaskDTO.status,
    });

    // Se não houver subTasks no DTO, apenas atualizamos a Task principal
    if (!updateTaskDTO.subTasks || updateTaskDTO.subTasks.length === 0) {
      await this.tasksRepository.update({ task });
      return task;
    }

    // Arrays para agrupar subtarefas a serem criadas e atualizadas
    const subTasksToCreate: Task[] = [];
    const subTasksToUpdate: Task[] = [];
    const complementarySubTasksToCreate: Task[] = [];
    const complementarySubTasksToUpdate: Task[] = [];

    for (const subTaskDTO of updateTaskDTO.subTasks) {
      if(subTaskDTO.id) {
        // Se a subTask já existir, buscá-la para atualizar
        const existingSubTask = await this.findOneOrThrow({ id: subTaskDTO.id });
        existingSubTask.update({
          title: subTaskDTO.title,
          description: subTaskDTO.description,
          status: subTaskDTO.status,
        });

        subTasksToUpdate.push(existingSubTask);

        if (subTaskDTO.subTasks && subTaskDTO.subTasks.length > 0) {
          for (const cSubTaskDTO of subTaskDTO.subTasks) {
            if (cSubTaskDTO.id) {
              // Atualiza sub-subTasks existentes
              const existingCSubTask = await this.findOneOrThrow({ id: cSubTaskDTO.id });
              existingCSubTask.update({
                title: cSubTaskDTO.title,
                description: cSubTaskDTO.description,
                status: cSubTaskDTO.status,
              });

              complementarySubTasksToUpdate.push(existingCSubTask);
            } else {
              // Cria novas sub-subTasks
              const newCSubTask = Task.create({
                title: cSubTaskDTO.title,
                description: cSubTaskDTO.description,
                status: cSubTaskDTO.status,
                parentTaskId: existingSubTask.id,
                userId,
              });

              complementarySubTasksToCreate.push(newCSubTask);
            }
          }
        }
      } else {
        // Criar novas subtarefas
        const newSubTask = Task.create({
          title: subTaskDTO.title,
          description: subTaskDTO.description,
          status: subTaskDTO.status,
          parentTaskId: task.id,
          userId,
        });

        subTasksToCreate.push(newSubTask);

        if (subTaskDTO.subTasks && subTaskDTO.subTasks.length > 0) {
          for (const cSubTaskDTO of subTaskDTO.subTasks) {
            const newCSubTask = Task.create({
              title: cSubTaskDTO.title,
              description: cSubTaskDTO.description,
              status: cSubTaskDTO.status,
              parentTaskId: newSubTask.id,
              userId,
            });
  
            complementarySubTasksToCreate.push(newCSubTask);
          }
        }
      }
    }

    await this.unitOfWork.transaction(async (transaction) => {
      // Att task principal
      await this.tasksRepository.update({
        task,
        transaction,
      });

      // Atualiza subtarefas existentes 
      if(subTasksToUpdate.length > 0 ) {
        await this.tasksRepository.updateMany({
          tasks: subTasksToUpdate,
          transaction,
        });
      }

      if(subTasksToCreate.length > 0 ) {
        await this.tasksRepository.createMany({
          tasks: subTasksToCreate,
          transaction,
        });
      }

      // Atualiza sub-subTasks existentes
      if (complementarySubTasksToUpdate.length > 0) {
        await this.tasksRepository.updateMany({
          tasks: complementarySubTasksToUpdate,
          transaction,
        });
      }

      // Cria novas sub-subTasks
      if (complementarySubTasksToCreate.length > 0) {
        await this.tasksRepository.createMany({
          tasks: complementarySubTasksToCreate,
          transaction,
        });
      }
    });

    return task;
  }

  async delete(params: DeleteParams) {
    const { id } = params;

    const task = await this.findOneOrThrow({
      id
    });

    await this.unitOfWork.transaction(async (transaction) => {
      await this.tasksRepository.deleteByTaskParentId({
        task,
        transaction,
      });

      await this.tasksRepository.delete({
        task,
        transaction,
      });
    });
  }

  async #checkConflicts(params: CheckConflictsParams) {
    const { id, title, userId } = params;

    const messages: string[] = [];

    if(title) {
      await this.#checkTitleConflict({ id, title, messages, userId })
    }

    if(messages.length > 0) {
      throw new TasksServiceError(messages.join(', '), CoreErrorCode.CONFLICT);
    }
  }

  async #checkTitleConflict(params: CheckTitleConflictParams) {
    const { messages, title, id, userId } = params;

    const exists = !id 
      ? () => this.tasksRepository.exists({ title, userId })
      : () => this.tasksRepository.exclusive({
        id,
        title,
        userId,
      });

    const titleExists = await exists();

    if(titleExists) {
      messages.push('task error title already exists');
    }
  }
}

type CreateParams = {
  createTaskDTO: CreateTasksInputDTO;
  userId: string;
};

type UpdateParams = {
  id: string;
  updateTaskDTO: UpdateTasksInputDTO;
  userId: string;
};

type FindOneParams = {
  id: string;
  includes?: {
    subTasks?: boolean;
  };
};

type FindOneOrThrowParams = FindOneParams & {};

type FindManyParams = {
  filters?: FindManyTasksInputDTO;
  userId: string;
}

type DeleteParams = {
  id: string;
};

type CheckConflictsParams = {
  id?: string;
  title?: string;
  userId: string;
};

type CheckTitleConflictParams = {
  id?: string;
  title: string;
  userId: string;
  messages: string[];
};