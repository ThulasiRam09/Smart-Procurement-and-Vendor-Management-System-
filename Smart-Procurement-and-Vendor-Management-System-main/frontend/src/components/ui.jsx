import { Plus, Trash2, X } from 'lucide-react'

export const money = n => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })
export const fmtDate = d => (d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—')

export const Badge = ({ status }) => <span className={`badge ${String(status).toLowerCase()}`}>{String(status).replace('_', ' ')}</span>

export const PageHead = ({ title, sub, children }) => (
  <div className="page-head"><div><h1>{title}</h1><p>{sub}</p></div><div className="actions">{children}</div></div>
)

export const Stat = ({ icon: Icon, label, value, tone }) => (
  <div className="card stat"><div className={`stat-ic ${tone}`}><Icon size={22} /></div><div><small>{label}</small><h2>{value}</h2></div></div>
)

export const Alert = ({ msg }) => (msg ? <div className="alert">{msg}</div> : null)
export const Empty = ({ text }) => <div className="empty">{text}</div>

export function Modal({ title, onClose, children, wide }) {
  return (
    <div className="overlay" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${wide ? 'wide' : ''}`}>
        <div className="modal-head"><h3>{title}</h3><button className="icon-btn" onClick={onClose}><X size={18} /></button></div>
        {children}
      </div>
    </div>
  )
}

export const Field = ({ label, children }) => <label className="field"><span>{label}</span>{children}</label>

// Editable list of line items (used by requisitions and purchase orders)
export function ItemsEditor({ items, setItems, withDescription }) {
  const set = (i, k, v) => setItems(items.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)))
  const total = items.reduce((s, i) => s + (+i.quantity || 0) * (+i.unitPrice || 0), 0)
  return (
    <div className="items">
      <div className="items-head"><b>Items</b>
        <button type="button" className="btn ghost sm" onClick={() => setItems([...items, { itemName: '', description: '', quantity: 1, unitPrice: 0 }])}><Plus size={14} /> Add item</button>
      </div>
      {items.map((it, i) => (
        <div className="item-row" key={i}>
          <input placeholder="Item name" value={it.itemName} onChange={e => set(i, 'itemName', e.target.value)} required />
          {withDescription && <input placeholder="Specification" value={it.description} onChange={e => set(i, 'description', e.target.value)} />}
          <input type="number" min="1" placeholder="Qty" value={it.quantity} onChange={e => set(i, 'quantity', e.target.value)} />
          <input type="number" min="0" step="0.01" placeholder="Unit price" value={it.unitPrice} onChange={e => set(i, 'unitPrice', e.target.value)} />
          <button type="button" className="icon-btn danger" disabled={items.length === 1} onClick={() => setItems(items.filter((_, x) => x !== i))}><Trash2 size={16} /></button>
        </div>
      ))}
      <div className="items-total">Total <b>{money(total)}</b></div>
    </div>
  )
}

export const cleanItems = items =>
  items.filter(i => i.itemName.trim()).map(i => ({ ...i, itemName: i.itemName.trim(), quantity: +i.quantity || 1, unitPrice: +i.unitPrice || 0 }))
