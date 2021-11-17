import { BaseConfig } from '../type';

export enum StorageType {
  LOCAL = 'local',
  SESSION = 'session',
  NONE = 'none',
}

function getStorage(type: StorageType) {
  switch (type) {
    case StorageType.SESSION:
      return sessionStorage;
    case StorageType.LOCAL:
    default:
      return localStorage;
  }
}

function getParamsByKeys(
  keys: string[],
  option: {
    config: BaseConfig;
    type: StorageType;
    key?: string;
  }
) {
  const params: any = {};
  const storageParams = JSON.parse(
    getStorage(option.type).getItem(option.key || 'params') || '{}'
  );
  keys.forEach((key) => {
    if (option.config[key] && key in storageParams) {
      const value = option.config[key].parse(storageParams[key] as string, key);
      if (value !== null) {
        params[key] = value;
      }
    }
  });
  return params;
}

export { getParamsByKeys };
