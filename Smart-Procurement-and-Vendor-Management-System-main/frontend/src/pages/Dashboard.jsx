import { Link } from 'react-router-dom'
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Building2, Clock, FileText, ShoppingCart } from 'lucide-react'
import { useLoad } from '../api'
import { useAuth } from '../auth'
import { Alert, PageHead, Stat } from '../components/ui'

const COLORS = { PENDING: '#f59e0b', APPROVED: '#10b981', REJECTED: '#ef4444' }
const toData = o => Object.entries(o || {}).map(([name, value]) => ({ name, value }))

export default function Dashboard() {
  const { user } = useAuth()
  const { data, error, loading } = useLoad('/api/v1/dashboard')
  const mgmt = user.role !== 'EMPLOYEE'
  const po = toData(data?.poStatus), rq = toData(data?.requisitionStatus)

  return (
    <>
      <PageHead title={`Hello, ${user.username} 👋`} sub="Here is what's happening in your procurement pipeline." />
      <Alert msg={error} />
      <div className="stats">
        {mgmt && <Stat icon={Building2} label="Vendors" value={loading ? '…' : data?.vendors} tone="indigo" />}
        <Stat icon={FileText} label="Requisitions" value={loading ? '…' : data?.requisitions} tone="violet" />
        {mgmt && <Stat icon={ShoppingCart} label="Purchase Orders" value={loading ? '…' : data?.purchaseOrders} tone="sky" />}
        {mgmt && <Stat icon={Clock} label="Pending Approvals" value={loading ? '…' : data?.pendingApprovals} tone="amber" />}
      </div>

      <div className="grid2">
        <div className="card">
          <h3>Requisitions by status</h3>
          {rq.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={rq}><XAxis dataKey="name" tickLine={false} axisLine={false} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} width={30} /><Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>{rq.map(d => <Cell key={d.name} fill={COLORS[d.name] || '#6366f1'} />)}</Bar></BarChart>
            </ResponsiveContainer>
          ) : <div className="empty">No requisitions yet</div>}
        </div>
        {mgmt && (
          <div className="card">
            <h3>Purchase orders by status</h3>
            {po.length ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart><Pie data={po} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
                  {po.map(d => <Cell key={d.name} fill={COLORS[d.name] || '#6366f1'} />)}</Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
            ) : <div className="empty">No purchase orders yet</div>}
            <div className="legend">{po.map(d => <span key={d.name}><i style={{ background: COLORS[d.name] }} />{d.name} ({d.value})</span>)}</div>
          </div>
        )}
      </div>

      <div className="card quick"><h3>Quick actions</h3>
        <div>
          <Link className="btn ghost" to="/requisitions">New requisition</Link>
          {mgmt && <><Link className="btn ghost" to="/purchase-orders">Create purchase order</Link><Link className="btn ghost" to="/approvals">Review approvals</Link></>}
        </div>
      </div>
    </>
  )
}
