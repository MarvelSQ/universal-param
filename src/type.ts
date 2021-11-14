type ParamConfig<T> = {
  options?: (number | string)[];
  default?: T;
  parse: (value: string, key: string) => T | null;
  format: (value: T, key: string) => string;
};

type DefaultWrap<T> =
  | T
  | {
      default: T;
    };

type Options =
  | (number | string)[]
  | {
      options: (number | string)[];
    };

type ParamsConfig = Record<
  string,
  Options | ParamConfig<any> | DefaultWrap<Date | boolean | number | string>
>;

type PickType<C> = C extends ParamConfig<infer U>
  ? U
  : C extends Array<infer U>
  ? U
  : C;

type ReadConfig<P> = {
  [T in keyof P]: PickType<P[T]>;
};

export type BaseConfig = Record<string, ParamConfig<any>>;

export { ParamConfig, ReadConfig, ParamsConfig, BaseConfig };
