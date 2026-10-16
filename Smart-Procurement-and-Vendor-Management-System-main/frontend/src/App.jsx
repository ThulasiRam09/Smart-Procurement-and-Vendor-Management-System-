import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './auth'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Vendors from './pages/Vendors'
import Requisitions from './pages/Requisitions'
import PurchaseOrders from './pages/PurchaseOrders'
import Approvals from './pages/Approvals'

const MGMT = ['ADMIN', 'PROCUREMENT_MANAGER']

function Guard({ roles, children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Guard><Layout /></Guard>}>
        <Route index element={<Dashboard />} />
        <Route path="vendors" element={<Guard roles={MGMT}><Vendors /></Guard>} />
        <Route path="requisitions" element={<Requisitions />} />
        <Route path="purchase-orders" element={<Guard roles={MGMT}><PurchaseOrders /></Guard>} />
        <Route path="approvals" element={<Guard roles={MGMT}><Approvals /></Guard>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
