import { BaseConfig } from '../type';

function getParamsByKeys(keys: string[], config: BaseConfig) {
  const params: any = {};
  const searchParams = new URLSearchParams(location.search);
  keys.forEach((key) => {
    if (config[key] && searchParams.has(key)) {
      const value = config[key].parse(searchParams.get(key) as string, key);
      if (value !== null) {
        params[key] = value;
      }
    }
  });
  return params;
}

export { getParamsByKeys };
