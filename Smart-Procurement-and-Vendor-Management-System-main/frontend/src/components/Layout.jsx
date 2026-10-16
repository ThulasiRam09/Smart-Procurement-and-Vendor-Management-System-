import { NavLink, Outlet } from 'react-router-dom'
import { Building2, CheckCircle2, FileText, LayoutDashboard, LogOut, PackageCheck, ShoppingCart } from 'lucide-react'
import { useAuth } from '../auth'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: null },
  { to: '/vendors', label: 'Vendors', icon: Building2, roles: ['ADMIN', 'PROCUREMENT_MANAGER'] },
  { to: '/requisitions', label: 'Requisitions', icon: FileText, roles: null },
  { to: '/purchase-orders', label: 'Purchase Orders', icon: ShoppingCart, roles: ['ADMIN', 'PROCUREMENT_MANAGER'] },
  { to: '/approvals', label: 'Approvals', icon: CheckCircle2, roles: ['ADMIN', 'PROCUREMENT_MANAGER'] },
]
const roleLabel = r => r.replace('_', ' ').toLowerCase()

export default function Layout() {
  const { user, logout } = useAuth()
  return (
    <div className="app">
      <aside className="side">
        <div className="brand"><span className="logo"><PackageCheck size={20} /></span><div>Smart<b>Procure</b></div></div>
        <nav>
          {NAV.filter(n => !n.roles || n.roles.includes(user.role)).map(n => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
              <n.icon size={18} /> {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="side-foot">
          <div className="avatar">{user.username[0].toUpperCase()}</div>
          <div className="who"><b>{user.username}</b><small>{roleLabel(user.role)}</small></div>
          <button className="icon-btn" title="Sign out" onClick={logout}><LogOut size={17} /></button>
        </div>
      </aside>
      <main className="main"><Outlet /></main>
    </div>
  )
}
