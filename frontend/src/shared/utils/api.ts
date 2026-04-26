const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8787';

function getToken(): string | null {
  return localStorage.getItem('admin_token');
}

type AuthUser = { id: string; displayName: string; role: 'owner' | 'admin' | 'technician' };

function setAuth(token: string, user: AuthUser) {
  localStorage.setItem('admin_token', token);
  localStorage.setItem('admin_user', JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
}

function getUser(): AuthUser | null {
  const raw = localStorage.getItem('admin_user');
  if (!raw) return null;
  return JSON.parse(raw);
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (res.status === 401) {
    clearAuth();
    window.location.href = '/admin';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error((err as { error: string }).error);
  }

  return res.json() as Promise<T>;
}

export { apiFetch, getToken, setAuth, clearAuth, getUser };
