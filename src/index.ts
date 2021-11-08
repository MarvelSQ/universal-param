type ParamConfig<T> = {
  options?: (number | string)[];
  default?: T | T[];
  parse: (value: string, key: string) => T | null;
  format: (value: T, key: string) => string;
};

type PickType<C> = C extends ParamConfig<infer U>
  ? U
  : C extends Array<infer U>
  ? U
  : C;

type ReadConfig<P> = {
  [T in keyof P]: PickType<P[T]>;
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
  String: {
    parse: (str: string) => str,
    format: (value: string) => value,
  } as ParamConfig<string>,
} as const;

type ParamsConfig = Record<
  string,
  (number | string)[] | ParamConfig<any> | Date | boolean | number | string
>;

function createParams<C extends ParamsConfig>(paramsConfig: C) {
  const config = Object.entries(paramsConfig).reduce(
    (acc, [key, paramsConfig]) => {
      if (Array.isArray(paramsConfig)) {
        acc[key] = {
          options: paramsConfig,
          default: paramsConfig[0],
          parse(str: string) {
            return paramsConfig.includes(str) ? str : null;
          },
          format(value: string) {
            return value;
          },
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

  function updateParams(defaultParams: ReadConfig<C>) {
    const searchParams = new URLSearchParams(window.location.search);
    const storageParams = JSON.parse(
      localStorage.getItem('params') || '{}'
    ) as Record<string, any>;
    const result = {} as ReadConfig<C>;
    Object.entries(defaultParams).forEach(
      ([key, value]: [keyof typeof defaultParams & string, any]) => {
        const keyConfig = config[key];

        if (!keyConfig) {
          // must has a config
          throw new Error(`${key} must has a config`);
        }

        if (searchParams.has(key as string)) {
          result[key] = keyConfig.parse(searchParams.get(key) as string, key);
        } else if (storageParams[key]) {
          result[key] = keyConfig.parse(storageParams[key], key);
        } else {
          result[key] = value;
        }
      }
    );

    return {
      value: result,
    };
  }
  updateParams.config = config;
  return updateParams;
}

export default createParams;
