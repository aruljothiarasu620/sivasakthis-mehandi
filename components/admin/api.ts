export async function api<T = unknown>(url: string, method = 'GET', body?: unknown): Promise<T> {
  const r = await fetch(url, { method, headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((j as { error?: string }).error || 'Request failed');
  return j as T;
}
export async function upload(file: File) {
  const fd = new FormData(); fd.append('file', file);
  const r = await fetch('/api/admin/upload', { method: 'POST', body: fd }); const j = await r.json();
  if (!r.ok) throw new Error(j.error); return j.url as string;
}
