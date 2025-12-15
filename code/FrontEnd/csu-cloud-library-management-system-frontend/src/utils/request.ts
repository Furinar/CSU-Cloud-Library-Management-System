import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';

// const runtimeBase =
//   (window as any).__APP_API_BASE__ ||
//   localStorage.getItem('API_BASE_URL') ||
//   import.meta.env.VITE_API_URL ||
//   import.meta.env.VITE_API_BASE_URL ||
//   "http://localhost:8081/v1"
//   // 'http://127.0.0.1:4523/m1/7376759-7108806-default';

type ModuleHint = {
  module: string;
  reason: string;
};

const defaultHint: ModuleHint = {
  module: '系统模块',
  reason: '请求异常，请检查网络或服务状态',
};

const moduleHintRules: Array<{ keywords: (string | RegExp)[]; hint: ModuleHint }> = [
  {
    keywords: ['/user/login'],
    hint: { module: '登录模块', reason: '账号或密码错误，或服务返回错误' },
  },
  {
    keywords: ['/user/register'],
    hint: { module: '注册模块', reason: '注册信息有误，或服务返回错误' },
  },
  {
    keywords: ['/user/info'],
    hint: { module: '用户信息模块', reason: '登录状态失效，或服务返回错误' },
  },
  {
    keywords: ['/book', '/admin/book'],
    hint: { module: '图书模块', reason: '数据未配置或返回格式错误' },
  },
  {
    keywords: ['/borrow', '/admin/borrow'],
    hint: { module: '借阅模块', reason: '借阅/归还服务未就绪或库存/参数错误' },
  },
  {
    keywords: ['/notification'],
    hint: { module: '通知模块', reason: '通知服务未就绪或网络异常' },
  },
  {
    keywords: ['/admin/user'],
    hint: { module: '用户统计模块', reason: '统计服务未就绪或权限不足' },
  },
  {
    keywords: ['/review'],
    hint: { module: '评价模块', reason: '评价参数有误或服务返回错误' },
  },
];

const resolveModuleHint = (url?: string): ModuleHint => {
  if (!url) return defaultHint;
  const matched = moduleHintRules.find(({ keywords }) =>
    keywords.some((kw) => (typeof kw === 'string' ? url.includes(kw) : kw.test(url)))
  );
  return matched?.hint ?? defaultHint;
};

const looksLikeNoise = (msg: string) => {
  const cleaned = msg.trim();
  if (!cleaned) return true;
  if (/[\u4e00-\u9fa5]/.test(cleaned)) return false;
  return true;
};

const buildFriendlyMessage = (url?: string, rawMsg?: string) => {
  const { module, reason } = resolveModuleHint(url);
  const candidate = typeof rawMsg === 'string' ? rawMsg.trim() : '';
  const readable = candidate && !looksLikeNoise(candidate) ? candidate : reason;
  return `${module}：${readable}`;
};

type RequestConfig = AxiosRequestConfig & { silent?: boolean };

const service = axios.create({
  // baseURL: "http://127.0.0.1:4523/m1/7376759-7108806-default",
  baseURL: "http://localhost:8081/v1",
  timeout: 10000,
});

const showError = (msg?: string) => {
  ElMessage.error(msg || buildFriendlyMessage());
};

service.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[Request] Authorization header set:', config.headers.Authorization.substring(0, 20) + '...');
    } else {
      console.warn('[Request] No token found in localStorage!');
    }
    console.log('[Request] URL:', config.url, 'Method:', config.method);
    if (config.data) {
      console.log('[Request] Data:', config.data);
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    console.log('[Response] Status Code:', response.status, 'Response Code:', res.code, 'URL:', response.config?.url);
    
    if (res.code !== 200) {
      const friendlyMessage = buildFriendlyMessage(response.config?.url, res.msg);
      const error = new Error(friendlyMessage);
      (error as any).friendlyMessage = friendlyMessage;
      console.error('[Response] Error:', res.code, res.msg);
      if (!(response.config as RequestConfig)?.silent) {
        showError(friendlyMessage);
      }
      return Promise.reject(error);
    }
    return res.data;
  },
  (error: any) => {
    console.error('[Response Error] Status:', error?.response?.status, 'Data:', error?.response?.data);
    const errorMsg = error?.response?.data?.message || error?.response?.data?.msg || error?.message;
    const friendlyMessage = buildFriendlyMessage(error?.config?.url, errorMsg);
    if (error && typeof error === 'object') {
      (error as any).friendlyMessage = friendlyMessage;
    }
    if (!(error?.config as RequestConfig)?.silent) {
      showError(friendlyMessage);
    }
    return Promise.reject(error);
  }
);

const request = <T = any>(config: RequestConfig) => service.request<any, T>(config);

export default request;
