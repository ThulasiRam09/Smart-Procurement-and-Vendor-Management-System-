import { useCallback, useEffect, useState } from 'react'

export async function api(path, { method = 'GET', body, blob } = {}) {
  const token = localStorage.getItem('sp_token')
  const res = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (res.status === 401 && !path.startsWith('/api/auth')) {
    localStorage.removeItem('sp_token'); localStorage.removeItem('sp_user')
    window.location.href = '/login'
    throw new Error('Session expired')
  }
  if (!res.ok) {
    let msg = res.status === 403 ? "You don't have permission to do this" : `Request failed (${res.status})`
    try { const j = await res.json(); if (j.message) msg = j.message } catch { /* ignore */ }
    throw new Error(msg)
  }
  if (blob) return res.blob()
  return (res.headers.get('content-type') || '').includes('json') ? res.json() : res.text()
}

export function useLoad(path) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const reload = useCallback(() => {
    setLoading(true)
    api(path).then(d => { setData(d); setError('') }).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [path])
  useEffect(() => { reload() }, [reload])
  return { data, error, loading, reload }
}
