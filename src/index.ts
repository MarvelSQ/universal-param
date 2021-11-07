type ParamConfig<T> = {
  options?: (number | string)[];
  default?: T | T[];
  parse?: (value: string, key: string) => T;
  format?: (value: T, key: string) => string;
};

const Presets = {
  Date: {
    parse: (value: string) => new Date(value),
    format: (value: Date) => value.toISOString(),
  } as ParamConfig<Date>,
  Number: {
    parse: (value: string) => parseFloat(value),
    format: (value: number) => String(value),
  } as ParamConfig<number>,
  Boolean: {
    parse: (value: string) => ['true', ''].includes(value),
    format: (value: boolean) => String(value),
  } as ParamConfig<boolean>,
  String: {} as ParamConfig<boolean>,
} as const;

type ParamsConfig = Record<
  string,
  (number | string)[] | ParamConfig<any> | Date | boolean | number | string
>;

function createParams(paramsConfig: ParamsConfig) {
  const config = Object.entries(paramsConfig).reduce(
    (acc, [key, paramsConfig]) => {
      if (Array.isArray(paramsConfig)) {
        acc[key] = {
          options: paramsConfig,
          default: paramsConfig[0],
        };
      } else if (paramsConfig?.constructor.name in Presets) {
        acc[key] = {
          ...Presets[paramsConfig.constructor.name as keyof typeof Presets],
          default: paramsConfig,
        };
      } else if (typeof paramsConfig === 'object') {
        acc[key] = paramsConfig as ParamConfig<any>;
      } else {
        acc[key] = {
          ...Presets.String,
          default: paramsConfig,
        };
      }
      return acc;
    },
    {} as Record<string, ParamConfig<any>>
  );

  function updateParams() {
    console.log('todo');
  }
  updateParams.config = config;
  return updateParams;
}

export default createParams;
