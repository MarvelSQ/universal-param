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

function setParamsWithDiff(
  base: Record<string, any>,
  next: Record<string, any>,
  config: BaseConfig
) {
  const searchParams = new URLSearchParams(location.search);
  Object.entries(config).forEach(([key, { format }]) => {
    if (base[key] !== next[key]) {
      const value = format(next[key], key);
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
  });
  history.replaceState(
    null,
    document.title,
    `${location.pathname}?${searchParams.toString()}`
  );
}

export { getParamsByKeys, setParamsWithDiff };
