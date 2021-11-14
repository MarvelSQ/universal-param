import { BaseConfig } from '../type';

function getParamsByKeys(keys: string[], config: BaseConfig) {
  const params: any = {};
  const storageParams = JSON.parse(localStorage.getItem('params') || '{}');
  keys.forEach((key) => {
    if (config[key] && key in storageParams) {
      const value = config[key].parse(storageParams[key] as string, key);
      if (value !== null) {
        params[key] = value;
      }
    }
  });
  return params;
}

export { getParamsByKeys };
