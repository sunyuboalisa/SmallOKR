export interface User {
  username: string;
  password: string;
  token: string;
  namespaceUrl: string;
  status: 'online' | 'offline';
  tenantId?: string;
  tenantName?: string;
}
