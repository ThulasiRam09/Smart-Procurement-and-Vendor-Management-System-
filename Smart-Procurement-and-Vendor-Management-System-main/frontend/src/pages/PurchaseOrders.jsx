import { useState } from 'react'
import { Plus } from 'lucide-react'
import { api, useLoad } from '../api'
import { Alert, Badge, Empty, Field, ItemsEditor, Modal, PageHead, cleanItems, fmtDate, money } from '../components/ui'

const newNo = () => 'PO-' + Date.now().toString().slice(-6)
const blankItem = { itemName: '', quantity: 1, unitPrice: 0 }

export default function PurchaseOrders() {
  const { data, error, loading, reload } = useLoad('/api/v1/purchase-orders')
  const vendors = useLoad('/api/vendor')
  const [open, setOpen] = useState(false)
  const [no, setNo] = useState(newNo())
  const [vendorId, setVendorId] = useState('')
  const [items, setItems] = useState([blankItem])
  const [msg, setMsg] = useState('')

  const save = async e => {
    e.preventDefault()
    const clean = cleanItems(items)
    if (!clean.length) return setMsg('Add at least one item')
    try {
      await api('/api/v1/purchase-orders', { method: 'POST', body: { poNumber: no, vendorId: +vendorId, items: clean } })
      setOpen(false); setItems([blankItem]); setMsg(''); reload()
    } catch (x) { setMsg(x.message) }
  }

  return (
    <>
      <PageHead title="Purchase Orders" sub="Create orders against vendors. Each order is sent for approval automatically.">
        <button className="btn primary" onClick={() => { setNo(newNo()); setMsg(''); setOpen(true) }}><Plus size={16} /> Create PO</button>
      </PageHead>
      <Alert msg={error} />
      <div className="card">
        {loading ? <Empty text="Loading…" /> : !data?.length ? <Empty text="No purchase orders yet" /> : (
          <div className="table-wrap"><table>
            <thead><tr><th>PO number</th><th>Vendor</th><th>Items</th><th>Created</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>{data.map(p => (
              <tr key={p.id}>
                <td><b>{p.poNumber}</b></td><td>{p.vendor || '—'}</td>
                <td>{p.items.map(i => <div key={i.id}>{i.itemName} <span className="muted">× {i.quantity} @ {money(i.unitPrice)}</span></div>)}</td>
                <td>{fmtDate(p.createdAt)}</td><td><b>{money(p.total)}</b></td><td><Badge status={p.status} /></td>
              </tr>))}</tbody>
          </table></div>
        )}
      </div>
      {open && (
        <Modal title="Create purchase order" wide onClose={() => setOpen(false)}>
          <form onSubmit={save}>
            <Alert msg={msg} />
            <div className="two">
              <Field label="PO number"><input value={no} onChange={e => setNo(e.target.value)} required /></Field>
              <Field label="Vendor"><select value={vendorId} onChange={e => setVendorId(e.target.value)} required>
                <option value="">Select vendor…</option>
                {(vendors.data || []).filter(v => v.status === 'ACTIVE').map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select></Field>
            </div>
            <ItemsEditor items={items} setItems={setItems} />
            <div className="modal-foot"><button type="button" className="btn ghost" onClick={() => setOpen(false)}>Cancel</button><button className="btn primary">Create &amp; send for approval</button></div>
          </form>
        </Modal>
      )}
    </>
  )
}
