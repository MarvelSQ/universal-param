import { ParamsConfig, ReadConfig } from './type';
import { parseConfig } from './utils/config';

function createParams<C extends ParamsConfig>(paramsConfig: C) {
  const config = parseConfig(paramsConfig);

  function updateParams(defaultParams: ReadConfig<C>) {
    const searchParams = new URLSearchParams(window.location.search);
    const storageParams = JSON.parse(
      localStorage.getItem('params') || '{}'
    ) as Record<string, any>;
    const result = {} as ReadConfig<C>;
    Object.entries(defaultParams).forEach(
      ([key, value]: [keyof typeof defaultParams & string, any]) => {
        const keyConfig = config[key];

        if (!keyConfig) {
          // must has a config
          throw new Error(`${key} must has a config`);
        }

        if (searchParams.has(key as string)) {
          result[key] = keyConfig.parse(searchParams.get(key) as string, key);
        } else if (storageParams[key]) {
          result[key] = keyConfig.parse(storageParams[key], key);
        } else {
          result[key] = value;
        }
      }
    );

    return {
      value: result,
    };
  }
  updateParams.config = config;
  return updateParams;
}

export default createParams;
