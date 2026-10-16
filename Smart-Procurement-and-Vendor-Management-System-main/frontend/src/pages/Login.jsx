import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { BarChart3, PackageCheck, ShieldCheck, Workflow } from 'lucide-react'
import { useAuth } from '../auth'
import { Alert } from '../components/ui'

const DEMO = [['Admin', 'admin', 'admin123'], ['Manager', 'manager', 'manager123'], ['Employee', 'employee', 'employee123']]

export default function Login() {
  const { user, login } = useAuth()
  const nav = useNavigate()
  const [f, setF] = useState({ username: '', password: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  if (user) return <Navigate to="/" replace />

  const submit = async e => {
    e.preventDefault(); setBusy(true); setErr('')
    try { await login(f.username, f.password); nav('/') } catch (x) { setErr(x.message) } finally { setBusy(false) }
  }

  return (
    <div className="login">
      <section className="login-art">
        <div className="brand"><span className="logo"><PackageCheck size={22} /></span><div>Smart<b>Procure</b></div></div>
        <h1>Procurement, simplified from request to approval.</h1>
        <ul>
          <li><Workflow size={18} /> Requisition → Purchase Order → Approval workflow</li>
          <li><ShieldCheck size={18} /> Role-based access for Admin, Manager and Employee</li>
          <li><BarChart3 size={18} /> Live dashboard and vendor PDF / Excel reports</li>
        </ul>
      </section>
      <section className="login-form">
        <form onSubmit={submit}>
          <h2>Welcome back</h2><p className="muted">Sign in to your account</p>
          <Alert msg={err} />
          <label className="field"><span>Username</span><input autoFocus value={f.username} onChange={e => setF({ ...f, username: e.target.value })} required /></label>
          <label className="field"><span>Password</span><input type="password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} required /></label>
          <button className="btn primary block" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
          <div className="demo"><small>Demo accounts (click to fill)</small>
            <div>{DEMO.map(([l, u, p]) => <button type="button" key={u} className="chip" onClick={() => setF({ username: u, password: p })}>{l}</button>)}</div>
          </div>
        </form>
      </section>
    </div>
  )
}
