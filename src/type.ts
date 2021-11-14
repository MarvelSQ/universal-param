type ParamConfig<T> = {
  options?: (number | string)[];
  default?: T;
  parse: (value: string, key: string) => T | null;
  format: (value: T, key: string) => string;
};

type ParamsConfig = Record<
  string,
  (number | string)[] | ParamConfig<any> | Date | boolean | number | string
>;

type PickType<C> = C extends ParamConfig<infer U>
  ? U
  : C extends Array<infer U>
  ? U
  : C;

type ReadConfig<P> = {
  [T in keyof P]: PickType<P[T]>;
};

export { ParamConfig, ReadConfig, ParamsConfig };
