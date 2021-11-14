import { ParamConfig } from '../type';

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

export const isPresetType = (type: string): type is keyof typeof Presets =>
  Object.keys(Presets).includes(type);

export const getDefaultPreset = (defaultValue: any) => ({
  ...Presets.String,
  default: defaultValue,
});

export default Presets;
