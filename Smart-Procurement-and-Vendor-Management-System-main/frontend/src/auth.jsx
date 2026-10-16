import { createContext, useContext, useState } from 'react'
import { api } from './api'

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('sp_user') || 'null'))

  const login = async (username, password) => {
    const d = await api('/api/auth/login', { method: 'POST', body: { username, password } })
    const u = { username: d.username, role: d.role }
    localStorage.setItem('sp_token', d.token)
    localStorage.setItem('sp_user', JSON.stringify(u))
    setUser(u)
  }
  const logout = () => {
    localStorage.removeItem('sp_token'); localStorage.removeItem('sp_user'); setUser(null)
  }
  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>
}
