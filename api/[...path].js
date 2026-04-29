export const config = {
  runtime: 'edge',      // 开启边缘节点（30秒限制）
  regions: ['hnd1'],    // 强制指定东京机房，完美绕过香港封锁
};

export default async function handler(req) {
  const url = new URL(req.url);
  url.hostname = 'openrouter.ai';

  const headers = new Headers(req.headers);
  // 必须删掉这两个头，否则 OpenRouter 会把你的香港 IP 透传给 OpenAI 导致被拦截
  headers.delete('x-forwarded-for');
  headers.delete('x-real-ip');

  return fetch(url.toString(), {
    method: req.method,
    headers: headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    redirect: 'follow'
  });
}
