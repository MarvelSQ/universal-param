import { ParamsConfig, ReadConfig } from './type';
import { parseConfig } from './utils/config';
import updateParams from './utils/update';

function createParams<C extends ParamsConfig>(paramsConfig: C) {
  const config = parseConfig(paramsConfig);

  function read(defaultParams: ReadConfig<C>) {
    const result = updateParams(defaultParams, config);
    return {
      value: result,
    };
  }
  read.config = config;
  return read;
}

export default createParams;
