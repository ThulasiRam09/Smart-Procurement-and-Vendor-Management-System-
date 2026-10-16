import { useState } from 'react'
import { Plus } from 'lucide-react'
import { api, useLoad } from '../api'
import { Alert, Badge, Empty, Field, ItemsEditor, Modal, PageHead, cleanItems, fmtDate, money } from '../components/ui'

const newNo = () => 'REQ-' + Date.now().toString().slice(-6)
const blankItem = { itemName: '', description: '', quantity: 1, unitPrice: 0 }

export default function Requisitions() {
  const { data, error, loading, reload } = useLoad('/api/v1/requisitions')
  const [open, setOpen] = useState(false)
  const [no, setNo] = useState(newNo())
  const [items, setItems] = useState([blankItem])
  const [msg, setMsg] = useState('')

  const save = async e => {
    e.preventDefault()
    const clean = cleanItems(items)
    if (!clean.length) return setMsg('Add at least one item')
    try {
      await api('/api/v1/requisitions', { method: 'POST', body: { requisitionNumber: no, items: clean } })
      setOpen(false); setItems([blankItem]); setMsg(''); reload()
    } catch (x) { setMsg(x.message) }
  }

  return (
    <>
      <PageHead title="Requisitions" sub="Raise purchase requests and track their approval status.">
        <button className="btn primary" onClick={() => { setNo(newNo()); setMsg(''); setOpen(true) }}><Plus size={16} /> New requisition</button>
      </PageHead>
      <Alert msg={error} />
      <div className="card">
        {loading ? <Empty text="Loading…" /> : !data?.length ? <Empty text="No requisitions yet — create your first one" /> : (
          <div className="table-wrap"><table>
            <thead><tr><th>Number</th><th>Items</th><th>Requested by</th><th>Created</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>{data.map(r => (
              <tr key={r.id}>
                <td><b>{r.requisitionNumber}</b></td>
                <td>{r.items.map(i => <div key={i.id}>{i.itemName} <span className="muted">× {i.quantity}</span>{i.description && <div className="muted small">{i.description}</div>}</div>)}</td>
                <td>{r.requestedBy || '—'}</td><td>{fmtDate(r.createdAt)}</td><td><b>{money(r.total)}</b></td><td><Badge status={r.status} /></td>
              </tr>))}</tbody>
          </table></div>
        )}
      </div>
      {open && (
        <Modal title="New requisition" wide onClose={() => setOpen(false)}>
          <form onSubmit={save}>
            <Alert msg={msg} />
            <Field label="Requisition number"><input value={no} onChange={e => setNo(e.target.value)} required /></Field>
            <ItemsEditor items={items} setItems={setItems} withDescription />
            <div className="modal-foot"><button type="button" className="btn ghost" onClick={() => setOpen(false)}>Cancel</button><button className="btn primary">Submit for approval</button></div>
          </form>
        </Modal>
      )}
    </>
  )
}
