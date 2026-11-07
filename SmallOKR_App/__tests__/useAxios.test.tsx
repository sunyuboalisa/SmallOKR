import React from 'react';
import Renderer, { act } from 'react-test-renderer';
import axios from 'axios';
import { useAxios } from '../src/hooks/useAxios';
import { LoadingProvider, useLoadingLayer } from '../src/hooks/useLoadingLayer';
import { UserContext } from '../src/state/UserContext';
import { publishUserSessionExpired } from '../src/common/EventBusPubSub';

jest.mock('../src/state/UserContext', () => ({
  UserContext: require('react').createContext(null),
}));
jest.mock('../src/common/EventBusPubSub', () => ({
  publishUserSessionExpired: jest.fn(),
}));
jest.mock('axios', () => {
  const actual = jest.requireActual('axios');
  return { __esModule: true, ...actual, default: { create: jest.fn() } };
});

let request: ReturnType<typeof useAxios>['axiosRequest'];
let loading = false;
let requestRenders = 0;
const send = jest.fn();
let tree: Renderer.ReactTestRenderer;

function Requests() {
  request = useAxios().axiosRequest;
  requestRenders++;
  return null;
}
function Indicator() {
  loading = useLoadingLayer().loading;
  return null;
}
const user = {
  userInfo: { namespaceUrl: 'https://example.test', token: 'test-token' },
};
const deferred = () => {
  let resolve!: (value: any) => void;
  let reject!: (error: any) => void;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
};

beforeEach(async () => {
  jest.clearAllMocks();
  requestRenders = 0;
  (axios.create as jest.Mock).mockReturnValue({ request: send });
  await act(async () => {
    tree = Renderer.create(
      <LoadingProvider>
        <UserContext.Provider value={user as any}>
          <Requests />
          <Indicator />
        </UserContext.Provider>
      </LoadingProvider>,
    );
  });
});
afterEach(async () => {
  await act(async () => tree.unmount());
});

test('shares concurrent GETs, but fetches fresh data after completion', async () => {
  const result = deferred();
  send.mockReturnValueOnce(result.promise).mockResolvedValue({ data: 'fresh' });
  let first!: Promise<any>;
  await act(async () => {
    first = request({ method: 'GET', url: '/targets' });
    expect(request({ method: 'GET', url: '/targets' })).toBe(first);
  });
  expect(send).toHaveBeenCalledTimes(1);
  expect(loading).toBe(true);
  expect(requestRenders).toBe(1);
  await act(async () => {
    result.resolve({ data: 'initial' });
    await first;
  });
  expect(loading).toBe(false);
  await act(async () => {
    await request({ method: 'GET', url: '/targets' });
  });
  expect(send).toHaveBeenCalledTimes(2);
  expect(axios.create).toHaveBeenCalledWith({ timeout: 15000 });
  expect(send.mock.calls[0][0].headers.get('Authorization')).toBe(
    'Bearer test-token',
  );
});

test('keeps loading until every independent request settles, including failures', async () => {
  const one = deferred(),
    two = deferred();
  send.mockReturnValueOnce(one.promise).mockReturnValueOnce(two.promise);
  let first!: Promise<any>, second!: Promise<any>;
  await act(async () => {
    first = request({ url: '/one' });
    second = request({ url: '/two' }).catch(error => error);
  });
  await act(async () => {
    one.resolve({ data: [] });
    await first;
  });
  expect(loading).toBe(true);
  await act(async () => {
    two.reject(new Error('offline'));
    await second;
  });
  expect(loading).toBe(false);
  expect(requestRenders).toBe(1);
});

test('background loads do not block the screen with the global loading layer', async () => {
  const result = deferred();
  send.mockReturnValueOnce(result.promise);
  let response!: Promise<any>;
  await act(async () => { response = request({ url: '/targets', showLoading: false }); });
  expect(loading).toBe(false);
  expect(requestRenders).toBe(1);
  await act(async () => { result.resolve({ data: [] }); await response; });
  expect(loading).toBe(false);
});

test('does not replay unauthorized requests with the same expired token', async () => {
  send.mockRejectedValueOnce({ response: { status: 401 } });
  await act(async () => {
    await expect(request({ url: '/private' })).rejects.toEqual({
      response: { status: 401 },
    });
  });
  expect(send).toHaveBeenCalledTimes(1);
  expect(publishUserSessionExpired).toHaveBeenCalledTimes(1);
  expect(loading).toBe(false);
});
test('permission denial does not expire an authenticated session', async () => {
  send.mockRejectedValueOnce({response: {status: 403}});
  await act(async () => {
    await expect(request({url: '/restricted'})).rejects.toEqual({response: {status: 403}});
  });
  expect(publishUserSessionExpired).not.toHaveBeenCalled();
  expect(loading).toBe(false);
});

test('does not merge writes or requests with independent cancellation', async () => {
  send.mockResolvedValue({ data: 'ok' });
  await act(async () => {
    await Promise.all([
      request({ method: 'POST', url: '/save', data: { name: 'a' } }),
      request({ method: 'POST', url: '/save', data: { name: 'a' } }),
      request({ url: '/read', signal: new AbortController().signal }),
      request({ url: '/read', signal: new AbortController().signal }),
    ]);
  });
  expect(send).toHaveBeenCalledTimes(4);
  expect(loading).toBe(false);
});
