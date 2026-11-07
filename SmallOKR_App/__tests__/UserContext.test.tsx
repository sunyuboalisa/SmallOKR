import React, { useContext } from 'react';
import Renderer, { act } from 'react-test-renderer';
import {
  UserContext,
  UserContextProvider,
  UserState,
} from '../src/state/UserContext';
import { StorageService } from '../src/service/StorageService';
import { eventBus } from '../src/common/EventBus';
import { USER_EVENTS } from '../src/common/EventType';

const mockHealthCheck = jest.fn().mockResolvedValue(true);
jest.mock(
  '@env',
  () => ({
    API_SCHEME: 'https',
    API_HOST: 'example.test',
    API_PORT: '443',
  }),
  { virtual: true },
);
jest.mock('../src/state/AppConfigContext', () => ({
  AppConfigContext: require('react').createContext({ rememberMe: true }),
}));
jest.mock('../src/service/UserService', () => {
  const service = { healthCheck: (...args: any[]) => mockHealthCheck(...args) };
  return { __esModule: true, default: () => service };
});
jest.mock('../src/service/StorageService', () => ({
  StorageService: {
    getUser: jest.fn(),
    saveUser: jest.fn().mockResolvedValue(undefined),
    clearUser: jest.fn(),
  },
}));

let state: UserState;
let tree: Renderer.ReactTestRenderer;
const account = {
  username: 'test',
  password: '',
  token: '',
  namespaceUrl: 'https://example.test',
  status: 'online' as const,
};
function Consumer() {
  state = useContext(UserContext);
  return null;
}
beforeEach(() => {
  jest.clearAllMocks();
});
afterEach(async () => {
  if (tree) await act(async () => tree.unmount());
});
async function mount() {
  await act(async () => {
    tree = Renderer.create(
      <UserContextProvider>
        <Consumer />
      </UserContextProvider>,
    );
  });
}

test('remembered account without a token stays on login instead of loading protected data', async () => {
  (StorageService.getUser as jest.Mock).mockResolvedValue(account);
  await mount();
  expect(state.userInfo.status).toBe('offline');
  expect(state.isLoading).toBe(false);
  expect(mockHealthCheck).not.toHaveBeenCalled();
  expect(StorageService.saveUser).toHaveBeenLastCalledWith(
    expect.objectContaining({ token: '', status: 'offline' }),
  );
});

test('restores a session with a token and clears it when authentication expires', async () => {
  (StorageService.getUser as jest.Mock).mockResolvedValue({
    ...account,
    token: 'test-token',
  });
  await mount();
  expect(state.userInfo.status).toBe('online');
  expect(mockHealthCheck).toHaveBeenCalledTimes(1);
  await act(async () => {
    eventBus.emit(USER_EVENTS.USER_SESSION_EXPIRED);
  });
  expect(state.userInfo.status).toBe('offline');
  expect(state.userInfo.token).toBe('');
  expect(StorageService.saveUser).toHaveBeenLastCalledWith(
    expect.objectContaining({ token: '', password: '', status: 'offline' }),
  );
});
