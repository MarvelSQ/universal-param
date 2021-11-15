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
  config: BaseConfig,
  type: StorageType
) {
  const params: any = {};
  const storageParams = JSON.parse(getStorage(type).getItem('params') || '{}');
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
