import dateFns from 'date-fns';
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
    return dateFns.format(date, 'YYYY-MM-DD');
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
    hasName: false,
    word: 'test',
    begin: new Date('2021-11-10'),
    end: new Date('2021-11-11'),
    page: 10,
  });
});
