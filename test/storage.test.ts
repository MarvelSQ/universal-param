import createParams from '../src';
import { StorageType } from '../src/utils/storage';
const params = createParams({
  pageType: ['sm', 'md', 'lg', 'xl'],
});

beforeEach(() => {
  history.pushState({}, '', '/');
  localStorage.setItem(
    'params',
    JSON.stringify({
      pageType: 'md',
    })
  );
  sessionStorage.setItem(
    'params',
    JSON.stringify({
      pageType: 'lg',
    })
  );
});

test('should use local storage', () => {
  const { value: localValue } = params(
    {
      pageType: 'sm',
    },
    {
      storageType: StorageType.LOCAL,
    }
  );
  expect(localValue).toEqual({
    pageType: 'md',
  });
});

test('should use session storage', () => {
  const { value: sessionValue } = params(
    {
      pageType: 'sm',
    },
    {
      storageType: StorageType.SESSION,
    }
  );
  expect(sessionValue).toEqual({
    pageType: 'lg',
  });
});

test('should not use storage', () => {
  const { value: noneValue } = params(
    {
      pageType: 'sm',
    },
    {
      storageType: StorageType.NONE,
    }
  );
  expect(noneValue).toEqual({
    pageType: 'sm',
  });
});

test('should use local storage as default', () => {
  const { value: noneValue } = params(
    {
      pageType: 'sm',
    },
    {}
  );
  expect(noneValue).toEqual({
    pageType: 'md',
  });
});

test('should use custom local storage key', () => {
  localStorage.setItem('user', JSON.stringify({ pageType: 'xl' }));
  const { value: noneValue } = params(
    {
      pageType: 'sm',
    },
    {
      storageKey: 'user',
    }
  );
  expect(noneValue).toEqual({
    pageType: 'xl',
  });
});

test('should use custom local storage key and invalid value', () => {
  localStorage.setItem('user', JSON.stringify({ pageType: 'xs' }));
  const { value: noneValue } = params(
    {
      pageType: 'sm',
    },
    {
      storageKey: 'user',
    }
  );
  expect(noneValue).toEqual({
    pageType: 'sm',
  });
});
