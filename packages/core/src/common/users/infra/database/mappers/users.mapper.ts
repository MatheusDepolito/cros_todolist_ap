import { User } from "../../../domain/user.model";
import { UserEntity } from "../entities/user.entity";

export class UsersMapper {
  static toDomain(userEntity: UserEntity): User {
    return User.load({
      id: userEntity.id,
      username: userEntity.username,
      email: userEntity.email,
      password: userEntity.password,
      createdAt: userEntity.created_at,
      updatedAt: userEntity.updated_at,
    });
  }

  static toPersistence(user: User): UserEntity {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }
}