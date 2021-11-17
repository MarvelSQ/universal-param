import { ParamsConfig, ReadConfig } from './type';
import { parseConfig } from './utils/config';
import { StorageType } from './utils/storage';
import updateParams from './utils/update';

function createParams<C extends ParamsConfig>(paramsConfig: C) {
  const config = parseConfig(paramsConfig);

  function read(
    defaultParams: ReadConfig<C>,
    {
      storageType = StorageType.LOCAL,
      storageKey,
    }: {
      storageType?: StorageType;
      storageKey?: string;
    } = {
      storageType: StorageType.LOCAL,
    }
  ) {
    const result = updateParams(defaultParams, {
      config,
      storage: storageType,
      storageKey,
    });
    return {
      value: result,
    };
  }
  read.config = config;
  return read;
}

export default createParams;
