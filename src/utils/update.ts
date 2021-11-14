import { BaseConfig } from '../type';
import * as search from './search';
import * as storage from './storage';

function updateParams(
  defaultParams: Record<string, any>,
  paramsConfig: BaseConfig
) {
  const keys = Object.keys(defaultParams);

  const searchParams = search.getParamsByKeys(keys, paramsConfig);
  const storageParams = storage.getParamsByKeys(keys, paramsConfig);

  return {
    ...defaultParams,
    ...storageParams,
    ...searchParams,
  };
}

export default updateParams;
