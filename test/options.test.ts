import createParams from '../src';
const params = createParams({
  pageType: ['sm', 'md', 'lg'],
});

test('create config from options', () => {
  expect(params.config.pageType.options).toEqual(['sm', 'md', 'lg']);
});

test('create config from object with options', () => {
  const params = createParams({
    pageType: {
      options: ['sm', 'md', 'lg'],
    },
  });
  expect(params.config.pageType.options).toEqual(['sm', 'md', 'lg']);
});

test('read option from default', () => {
  const { value: currentParams } = params({
    pageType: 'sm',
  });

  expect(currentParams.pageType).toEqual('sm');
});

test('read option from search', () => {
  history.pushState({}, '', '?pageType=lg');

  const { value: currentParams } = params({
    pageType: 'sm',
  });

  expect(currentParams.pageType).toEqual('lg');
});

test('read option from wrong search', () => {
  history.pushState({}, '', '?pageType=xs');

  const { value: currentParams } = params({
    pageType: 'sm',
  });

  expect(currentParams.pageType).toEqual('sm');
});
