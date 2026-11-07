import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet} from 'react-native';
import axios from 'axios';
import {UserContext, UserDispatchContext} from '../state/UserContext';
import {ThemeContext} from '../state/ThemeContext';

type Tenant = {id: string; name: string; enabled: boolean; role: string};
export default function TenantGate({children}: {children: React.ReactNode}) {
  const {userInfo} = useContext(UserContext);
  const dispatch = useContext(UserDispatchContext);
  const theme = useContext(ThemeContext)?.theme;
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let alive = true;
    setLoading(true);setReady(false);setError('');
    const client = axios.create({baseURL: userInfo.namespaceUrl, timeout: 15000, headers: {Authorization: `Bearer ${userInfo.token}`}});
    (async () => {
      try {
        const capability = await client.get('/api/v1/user/tenancy');
        if (!capability.data.enabled) {if (alive) setReady(true);return;}
        const response = await client.get<Tenant[]>('/api/v1/user/tenants');
        const active = response.data.filter(tenant => tenant.enabled);
        if (alive) {
          setTenants(active);
          setReady(Boolean(userInfo.tenantId && active.some(tenant => tenant.id === userInfo.tenantId)));
        }
      } catch (failure) {
        // Older single-tenant servers do not expose this endpoint.
        if (axios.isAxiosError(failure) && failure.response?.status === 404) {if (alive) setReady(true);}
        else if (alive) setError('无法获取租户，请重试或重新登录');
      } finally {if (alive) setLoading(false);}
    })();
    return () => {alive = false;};
  }, [userInfo.namespaceUrl, userInfo.token, userInfo.tenantId, attempt]);
  const choose = async (tenant: Tenant) => {
    setLoading(true);setError('');
    try {
      const response = await axios.post(`${userInfo.namespaceUrl}/api/v1/user/tenants/${encodeURIComponent(tenant.id)}/token`, {}, {timeout: 15000, headers: {Authorization: `Bearer ${userInfo.token}`}});
      dispatch({type: 'Login', user: {...userInfo, token: response.data.access_token, tenantId: tenant.id, tenantName: tenant.name}});
    } catch {setError('无法进入该租户，请检查成员资格');setLoading(false);}
  };
  const create = async () => {
    if (!name.trim()) return;
    setLoading(true);setError('');
    try {
      const response = await axios.post(`${userInfo.namespaceUrl}/api/v1/user/tenants`, {name: name.trim()}, {timeout: 15000, headers: {Authorization: `Bearer ${userInfo.token}`}});
      await choose({id: response.data.tenantId, name: name.trim(), enabled: true, role: 'OWNER'});
    } catch {setError('创建租户失败，请稍后重试');setLoading(false);}
  };
  if (loading) return <View style={styles.center}><ActivityIndicator/><Text>正在加载空间…</Text></View>;
  if (ready) return <View style={{flex: 1}}>
    {userInfo.tenantId ? <TouchableOpacity accessibilityRole="button" style={{padding: 10, alignItems: 'center'}} onPress={() => setReady(false)}><Text style={{color: theme?.colors.primary}}>{userInfo.tenantName || '当前空间'} · 切换空间</Text></TouchableOpacity> : null}
    {children}
  </View>;
  return <ScrollView contentContainerStyle={[styles.container, {backgroundColor: theme?.colors.background}]}>
    <Text style={[styles.title, {color: theme?.colors.text}]}>选择工作空间</Text>
    <Text style={{color: theme?.colors.text}}>不同空间的目标和待办相互独立。</Text>
    {tenants.map(tenant => <TouchableOpacity accessibilityRole="button" key={tenant.id} style={styles.card} onPress={() => choose(tenant)}><Text style={{color: theme?.colors.text}}>{tenant.name} · {tenant.role}</Text></TouchableOpacity>)}
    {!error && tenants.length === 0 ? <><Text style={{color: theme?.colors.text}}>还没有可用空间。你可以创建，或在网页管理端接受邀请。</Text><TextInput accessibilityLabel="空间名称" style={[styles.card, {color: theme?.colors.text}]} placeholder="新空间名称" value={name} onChangeText={setName}/><TouchableOpacity accessibilityRole="button" style={styles.card} onPress={create}><Text style={{color: theme?.colors.primary}}>创建空间</Text></TouchableOpacity></> : null}
    {error ? <Text style={styles.error}>{error}</Text> : null}
    <TouchableOpacity accessibilityRole="button" style={styles.card} onPress={() => setAttempt(value => value + 1)}><Text style={{color: theme?.colors.primary}}>刷新</Text></TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" style={styles.card} onPress={() => dispatch({type: 'Logout'})}><Text style={{color: theme?.colors.primary}}>退出登录</Text></TouchableOpacity>
  </ScrollView>;
}
const styles = StyleSheet.create({container: {flexGrow: 1, padding: 24, gap: 14}, center: {flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12}, title: {fontSize: 23, fontWeight: '600'}, card: {borderWidth: StyleSheet.hairlineWidth, borderColor: '#888', borderRadius: 10, padding: 16}, error: {color: '#b42318'}});
