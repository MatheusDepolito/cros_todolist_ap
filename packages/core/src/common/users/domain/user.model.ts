import { isEmail, isNotEmpty, isString, isUUID, maxLength, minLength } from "class-validator";
import { CoreError } from "../../../shared/errors/application/core-error";
import { CoreErrorCode } from "../../../shared/errors/application/core-error-code.enum";
import bcrypt from 'bcrypt';

export type UserProps = Omit<User, 'update'>;
export type CreateUserProps = Omit<UserProps,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateUserProps = Partial<
  Omit<
    UserProps,
    'id' | 'createdAt' | 'updatedAt'
  >
>;

export class UserError extends CoreError {}

export class User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  private constructor(props: UserProps) {
    Object.assign(this, props);
  }

  static async create(props: CreateUserProps): Promise<User> {
    const user = new User({
      id: crypto.randomUUID(),
      username: props.username,
      email: props.email,
      password: await bcrypt.hash(props.password, 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    user.#validate();

    return user;
  }

  static load(props: UserProps): User {
    const user = new User(props);

    user.#validate();

    return user;
  }

  async update(props: UpdateUserProps) {
    if (props.username !== undefined) this.username = props.username;
    if (props.email !== undefined) this.email = props.email;
    if (props.password !== undefined) this.password = props.password;

    this.updatedAt = new Date();

    this.#validate();
  }

  #validate() {
    const messages: string[] = [];

    if (!isNotEmpty(this.id)) messages.push('id should not be empty');
    if (!isUUID(this.id)) messages.push('id must be a UUID');

    if (!isNotEmpty(this.username)) messages.push('username should not be empty');
    if (!isString(this.username)) messages.push('username must be a string');
    if (!minLength(this.username, 3))
      messages.push('username must be longer than or equal to 3 characters');
    if (!maxLength(this.username, 64))
      messages.push('username must be shorter than or equal to 64 characters');

    if (this.email !== null) {
      if (!isNotEmpty(this.email)) messages.push('email should not be empty');
      if (!isString(this.email)) messages.push('email must be a string');
      if (!isEmail(this.email)) messages.push('email must be a valid email');
    }

    if (!isNotEmpty(this.password)) messages.push('password should not be empty');
    if (!isString(this.password)) messages.push('password must be a string');
    if (!minLength(this.password, 8))
      messages.push('password must be longer than or equal to 8 characters');
    if (!maxLength(this.password, 64))
      messages.push('password must be shorter than or equal to 64 characters');

    if (messages.length > 0) {
      throw new UserError(messages.join(', '), CoreErrorCode.UNPROCESSABLE_ENTITY);
    }
  }
}