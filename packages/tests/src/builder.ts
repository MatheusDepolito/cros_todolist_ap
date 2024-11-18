export abstract class Builder<T> {
  props: Partial<T>;

  constructor(props: Partial<T>) {
    this.props = props;
  }

  abstract build(): Promise<T>;

  static removeUndefinedFields<T extends {}>(obj: T) {
    (Object.keys(obj) as (keyof T)[]).forEach((key) => {
      if (obj[key] === undefined) {
        delete obj[key];
      }
    });
  }
}
