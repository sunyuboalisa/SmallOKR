import {API_BASE_URL} from '@env';
import {defaultBusinessUrl, userServiceUrl, requestBaseUrl, restoredBusinessUrl} from '../src/common/ApiConfig';

test('keeps user requests on the account gateway while business uses the selected space', () => {
  expect(requestBaseUrl('/api/v1/user/signin', 'http://internal:8100')).toBe(userServiceUrl);
  expect(requestBaseUrl('/api/v1/user/tenants', 'http://internal:8100')).toBe(userServiceUrl);
  expect(requestBaseUrl('/api/v1/todo/get', 'http://internal:8100')).toBe('http://internal:8100');
  expect(requestBaseUrl('/target-service/api/v1/target/get', 'http://internal:8100')).toBe('http://internal:8100');
});

test('explicit profile replaces a saved address while legacy profiles retain it', () => {
  const savedUrl = 'http://old-internal:8100';
  expect(restoredBusinessUrl(savedUrl)).toBe(API_BASE_URL ? defaultBusinessUrl : savedUrl);
  expect(restoredBusinessUrl()).toBe(defaultBusinessUrl);
});
