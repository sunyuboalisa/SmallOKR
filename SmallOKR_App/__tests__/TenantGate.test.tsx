import React from 'react';
import Renderer, {act} from 'react-test-renderer';
import axios from 'axios';
import TenantGate from '../src/components/TenantGate';
import {UserContext, UserDispatchContext} from '../src/state/UserContext';
jest.mock('react-native', () => ({View: 'View', Text: 'Text', ScrollView: 'ScrollView', TouchableOpacity: 'TouchableOpacity', TextInput: 'TextInput', ActivityIndicator: 'ActivityIndicator', StyleSheet: {create: (s: any) => s, hairlineWidth: 1}}));
jest.mock('../src/state/UserContext', () => {
  const R = require('react');return {UserContext: R.createContext(null), UserDispatchContext: R.createContext(null)};
});
jest.mock('../src/state/ThemeContext', () => ({ThemeContext: require('react').createContext(undefined)}));
jest.mock('axios', () => ({__esModule: true, default: {create: jest.fn(), post: jest.fn(), isAxiosError: (e: any) => Boolean(e?.response)}}));
const user = {username: 'alice', password: '', token: 'login-token', namespaceUrl: 'https://example.test', status: 'online' as const};
const dispatch = jest.fn();
const get = jest.fn();
const Data = () => null;
function fixture(info: any = user) {return <UserContext.Provider value={{userInfo: info, isLoading: false}}><UserDispatchContext.Provider value={dispatch}><TenantGate><Data/></TenantGate></UserDispatchContext.Provider></UserContext.Provider>;}
beforeEach(() => {jest.clearAllMocks();(axios.create as jest.Mock).mockReturnValue({get});});
test('legacy mode mounts business screens without selecting a tenant', async () => {
  get.mockResolvedValue({data: {enabled: false}});let tree!: Renderer.ReactTestRenderer;
  await act(async () => {tree = Renderer.create(fixture());});
  expect(tree.root.findAllByType(Data)).toHaveLength(1);
  await act(async () => tree.unmount());
});
test('tenant mode gates data loading and clears business screens while switching', async () => {
  get.mockImplementation((path: string) => Promise.resolve({data: path.endsWith('/tenancy') ? {enabled: true} : [{id: 'a', name: 'A', enabled: true, role: 'MEMBER'}, {id: 'b', name: 'B', enabled: true, role: 'ADMIN'}]}));
  (axios.post as jest.Mock).mockResolvedValue({data: {access_token: 'tenant-a-token'}});
  let tree!: Renderer.ReactTestRenderer;
  await act(async () => {tree = Renderer.create(fixture());});
  expect(tree.root.findAllByType(Data)).toHaveLength(0);
  const button = tree.root.findAllByType('TouchableOpacity' as any).find(b => b.findAllByType('Text' as any).some(t => t.children.join('').includes('A · MEMBER')))!;
  await act(async () => {await button.props.onPress();});
  expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({type: 'Login', user: expect.objectContaining({tenantId: 'a', token: 'tenant-a-token'})}));
  await act(async () => {tree.update(fixture(dispatch.mock.calls[0][0].user));});
  expect(tree.root.findAllByType(Data)).toHaveLength(1);
  const switcher = tree.root.findAllByType('TouchableOpacity' as any).find(b => b.findAllByType('Text' as any).some(t => t.children.join('').includes('切换空间')))!;
  await act(async () => switcher.props.onPress());
  expect(tree.root.findAllByType(Data)).toHaveLength(0);
  await act(async () => tree.unmount());
});
