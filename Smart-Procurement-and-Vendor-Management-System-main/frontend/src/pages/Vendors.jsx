import { useState } from 'react'
import { Download, Plus, Search, Trash2 } from 'lucide-react'
import { api, useLoad } from '../api'
import { useAuth } from '../auth'
import { Alert, Badge, Empty, Field, Modal, PageHead } from '../components/ui'

const blank = { name: '', email: '', contactNumber: '', address: '', status: 'ACTIVE' }

export default function Vendors() {
  const { user } = useAuth()
  const { data, error, loading, reload } = useLoad('/api/vendor')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [f, setF] = useState(blank)
  const [msg, setMsg] = useState('')
  const list = (data || []).filter(v => `${v.name} ${v.email}`.toLowerCase().includes(q.toLowerCase()))

  const save = async e => {
    e.preventDefault()
    try { await api('/api/vendor', { method: 'POST', body: f }); setOpen(false); setF(blank); reload() } catch (x) { setMsg(x.message) }
  }
  const remove = async v => {
    if (!confirm(`Delete vendor "${v.name}"?`)) return
    try { await api(`/api/vendor/${v.id}`, { method: 'DELETE' }); reload() } catch (x) { setMsg(x.message) }
  }
  const report = async (v, format) => {
    try {
      const blob = await api(`/api/reports/vendor/${v.id}?format=${format}`, { blob: true })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob); a.download = `vendor-${v.id}.${format === 'excel' ? 'xlsx' : 'pdf'}`; a.click()
    } catch (x) { setMsg(x.message) }
  }

  return (
    <>
      <PageHead title="Vendors" sub="Manage your supplier directory and download vendor reports.">
        <button className="btn primary" onClick={() => { setMsg(''); setOpen(true) }}><Plus size={16} /> Add vendor</button>
      </PageHead>
      <Alert msg={error || msg} />
      <div className="card">
        <div className="toolbar"><div className="search"><Search size={16} /><input placeholder="Search vendors…" value={q} onChange={e => setQ(e.target.value)} /></div><small>{list.length} vendors</small></div>
        {loading ? <Empty text="Loading…" /> : !list.length ? <Empty text="No vendors found" /> : (
          <div className="table-wrap"><table>
            <thead><tr><th>Vendor</th><th>Contact</th><th>Address</th><th>Status</th><th /></tr></thead>
            <tbody>{list.map(v => (
              <tr key={v.id}>
                <td><b>{v.name}</b><div className="muted">{v.email}</div></td>
                <td>{v.contactNumber || '—'}</td><td>{v.address || '—'}</td><td><Badge status={v.status} /></td>
                <td className="row-actions">
                  <button className="btn ghost sm" onClick={() => report(v, 'pdf')}><Download size={14} /> PDF</button>
                  <button className="btn ghost sm" onClick={() => report(v, 'excel')}><Download size={14} /> Excel</button>
                  {user.role === 'ADMIN' && <button className="icon-btn danger" title="Delete" onClick={() => remove(v)}><Trash2 size={16} /></button>}
                </td>
              </tr>))}</tbody>
          </table></div>
        )}
      </div>
      {open && (
        <Modal title="Add vendor" onClose={() => setOpen(false)}>
          <form onSubmit={save}>
            <Alert msg={msg} />
            <Field label="Vendor name"><input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} required /></Field>
            <div className="two"><Field label="Email"><input type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} required /></Field>
              <Field label="Phone"><input value={f.contactNumber} onChange={e => setF({ ...f, contactNumber: e.target.value })} /></Field></div>
            <Field label="Address"><input value={f.address} onChange={e => setF({ ...f, address: e.target.value })} /></Field>
            <Field label="Status"><select value={f.status} onChange={e => setF({ ...f, status: e.target.value })}><option>ACTIVE</option><option>INACTIVE</option><option>PENDING_APPROVAL</option></select></Field>
            <div className="modal-foot"><button type="button" className="btn ghost" onClick={() => setOpen(false)}>Cancel</button><button className="btn primary">Save vendor</button></div>
          </form>
        </Modal>
      )}
    </>
  )
}
