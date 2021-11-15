import createParams from '../src';
import { StorageType } from '../src/utils/storage';
const params = createParams({
  pageType: ['sm', 'md', 'lg'],
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
