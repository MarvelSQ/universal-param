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

test('create params from config', () => {
  const paramsConfig = {
    dateType: ['DAILY', 'WEEKLY', 'MONTHLY'],
    begin: DateConfig,
    end: new Date(),
    hasName: true,
    word: undefined as unknown as string,
  };
  const globalParams = createParams(paramsConfig);

  expect(globalParams.config.dateType).toEqual({
    options: ['DAILY', 'WEEKLY', 'MONTHLY'],
    default: 'DAILY',
  });
  expect(globalParams.config.end.default).toEqual(paramsConfig.end);
});
