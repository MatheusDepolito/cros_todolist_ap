import { Knex } from "knex";
import { IKnexCommonSeeds } from "../knex-common-seeds.service";
import { UserEntity } from "../../../../../../common/users/infra/database/entities/user.entity";
import { UsersMapper } from "../../../../../../common/users/infra/database/mappers/users.mapper";
import { User } from "../../../../../../common/users/domain/user.model";

export default class KnexCommonSeeds implements IKnexCommonSeeds {
  async up(knex: Knex): Promise<void> {

    const user = User.load({
      id: crypto.randomUUID(),
      username: "matheus",
      email: "matheussousadg@gmail.com",
      password: "$2a$10$Rrkc9aCVYjTui5B3CEUV6ucevXaiGRDeFN39Pdu5lW.jEu08PFcri",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await knex<UserEntity>(`common.users`).insert(UsersMapper.toPersistence(user));
  }

  async down(knex: Knex): Promise<void> {
    await knex<UserEntity>(`common.users`).delete();
  }
}