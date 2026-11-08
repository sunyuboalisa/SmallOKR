import {API_BASE_URL, API_SCHEME, API_HOST, API_PORT, USER_API_BASE_URL} from '@env';

export const defaultBusinessUrl = (API_BASE_URL || `${API_SCHEME}://${API_HOST}:${API_PORT}`).replace(/\/$/, '');
export const userServiceUrl = (USER_API_BASE_URL || defaultBusinessUrl).replace(/\/$/, '');
export const restoredBusinessUrl = (saved?: string) => API_BASE_URL ? defaultBusinessUrl : saved || defaultBusinessUrl;

export function requestBaseUrl(url: string | undefined, businessUrl: string) {
  return url?.startsWith('/api/v1/user/') || url?.startsWith('/api/v1/authorization/')
    ? userServiceUrl
    : businessUrl;
}
