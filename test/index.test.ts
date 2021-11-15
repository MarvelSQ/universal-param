import format from 'date-fns/format';
import createParams from '../src';

const DateConfig = {
  parse(str: string) {
    const date = new Date(str);
    if (Number.isNaN(date.getTime())) {
      return null;
    }
    return date;
  },
  format(date: Date) {
    return format(date, 'yyyy-MM-dd');
  },
};

const PageSizeType = {
  SMALL: 30,
  MEDIUM: 50,
  LARGE: 100,
  30: 'SMALL',
  50: 'MEDIUM',
  100: 'LARGE',
} as const;

type PageSize = 30 | 50 | 100;

const CustomConfig = {
  parse(str: string) {
    if (str in PageSizeType) {
      return PageSizeType[str as 'SMALL' | 'MEDIUM' | 'LARGE'];
    }
    return null;
  },
  format(pagesize: PageSize) {
    return PageSizeType[pagesize] as unknown as string;
  },
};

enum DateType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

const GlobalParamsConfig = {
  dateType: [DateType.DAILY, DateType.WEEKLY, DateType.MONTHLY],
  begin: DateConfig,
  end: new Date(),
  hasName: true,
  word: undefined as unknown as string,
  pagesize: CustomConfig,
  page: 1,
};

test('error', () => {
  try {
    createParams({
      error: {} as any,
    });
  } catch (error: any) {
    expect(error.message).toBe('Invalid config for error: {}');
  }
});

test('default', () => {
  const params = createParams({
    error: {
      default: 'default text',
    } as any,
  });

  expect(params.config.error.default).toBe('default text');
});

test('symbol should be string', () => {
  const symbol = Symbol('symbol');
  const params = createParams({
    symbol: symbol as any,
  });

  expect(params.config.symbol.default).toBe(symbol);
});

test('create params from config', () => {
  const globalParams = createParams(GlobalParamsConfig);
  expect(globalParams.config.dateType.options).toEqual([
    'DAILY',
    'WEEKLY',
    'MONTHLY',
  ]);
  expect(globalParams.config.end.default).toEqual(GlobalParamsConfig.end);
});

test('generate params from config', () => {
  const globalParams = createParams(GlobalParamsConfig);
  const searchParams = new URLSearchParams();
  searchParams.set('dateType', 'MONTHLY');
  searchParams.set('begin', '2021-11-10');
  searchParams.set('page', '10');
  searchParams.set('hasName', 'false');
  history.replaceState(
    {},
    'test',
    `${location.pathname}?${searchParams.toString()}`
  );
  localStorage.setItem(
    'params',
    JSON.stringify({
      word: 'test',
      end: '2021-11-11',
    })
  );
  const defaultParams = {
    dateType: DateType.DAILY,
    begin: new Date(),
    end: new Date(),
    hasName: true,
    word: '',
    pagesize: PageSizeType.SMALL,
    page: 1,
  };
  const { value } = globalParams(defaultParams);

  expect(value).toEqual({
    ...defaultParams,
    dateType: DateType.MONTHLY,
    hasName: false,
    word: 'test',
    begin: new Date('2021-11-10'),
    end: new Date('2021-11-11'),
    page: 10,
  });

  const nextSearchParams = new URLSearchParams(location.search);

  expect(nextSearchParams.get('word')).toEqual('test');
  expect(nextSearchParams.get('end')).toEqual('2021-11-11T00:00:00.000Z');
});

afterEach(() => {
  history.replaceState({}, 'test', location.pathname);
  localStorage.removeItem('params');
});
