import { BaseConfig } from '../type';
import * as search from './search';
import * as storage from './storage';

function updateParams(
  defaultParams: Record<string, any>,
  option: {
    config: BaseConfig;
    storage: storage.StorageType;
  }
) {
  console.log('storage', option.storage);
  const keys = Object.keys(defaultParams);

  const searchParams = search.getParamsByKeys(keys, option.config);
  const storageParams =
    option.storage !== storage.StorageType.NONE
      ? storage.getParamsByKeys(keys, option.config, option.storage)
      : {};

  const nextParams = {
    ...defaultParams,
    ...storageParams,
    ...searchParams,
  };
  search.setParamsWithDiff(defaultParams, nextParams, option.config);

  return nextParams;
}

export default updateParams;
