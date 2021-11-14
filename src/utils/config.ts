import Presets, { getDefaultPreset } from '../constants/Presets';
import { ParamConfig, ParamsConfig } from '../type';

function generateParamConfigFromOptions<T extends string | number>(
  options: T[]
): ParamConfig<T> {
  return {
    options,
    default: options[0],
    parse: (value: string) => {
      if (options.includes(value as T)) {
        return value as T;
      }
      return null;
    },
    format: (value: T) => value.toString(),
  };
}

function generateParamConfigFromPreset<
  T extends Date | string | number | boolean
>(preset: T): ParamConfig<T> {
  return {
    ...Presets[preset.constructor.name as keyof typeof Presets],
    default: preset,
  } as ParamConfig<T>;
}

function parseConfig<C extends ParamsConfig>(config: C) {
  const baseConfig = {} as Record<keyof C, ParamConfig<any>>;
  Object.entries(config).forEach(([key, value]: [key: keyof C, value: any]) => {
    if (value === null || value === undefined) {
      baseConfig[key] = getDefaultPreset(value);
      return;
    }
    if (Array.isArray(value)) {
      baseConfig[key] = generateParamConfigFromOptions(value);
      return;
    }
    if (typeof value === 'object' && value.constructor.name !== 'Date') {
      if ('parse' in value && 'format' in value) {
        baseConfig[key] = value;
        return;
      } else if ('options' in value) {
        baseConfig[key] = generateParamConfigFromOptions(value.options);
        return;
      } else if ('default' in value) {
        baseConfig[key] = generateParamConfigFromPreset(value.default);
        return;
      }
      throw new Error(`Invalid config for ${key}: ${JSON.stringify(value)}`);
    }
    baseConfig[key] = generateParamConfigFromPreset(value);
  });
  return baseConfig;
}

export { ParamConfig, parseConfig };
