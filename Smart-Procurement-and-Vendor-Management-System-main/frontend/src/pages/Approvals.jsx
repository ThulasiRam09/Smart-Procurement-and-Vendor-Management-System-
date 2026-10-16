import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { api, useLoad } from '../api'
import { Alert, Badge, Empty, Field, Modal, PageHead, fmtDate, money } from '../components/ui'

const TABS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED']

export default function Approvals() {
  const { data, error, loading, reload } = useLoad('/api/v1/approvals')
  const [tab, setTab] = useState('PENDING')
  const [rej, setRej] = useState(null)
  const [comment, setComment] = useState('')
  const [msg, setMsg] = useState('')
  const list = (data || []).filter(a => tab === 'ALL' || a.status === tab)

  const decide = async (a, status, comments = '') => {
    try { await api(`/api/v1/approvals/${a.id}/decision`, { method: 'POST', body: { status, comments } }); setRej(null); setComment(''); reload() }
    catch (x) { setMsg(x.message) }
  }

  return (
    <>
      <PageHead title="Approval Center" sub="Review requisitions and purchase orders awaiting a decision." />
      <Alert msg={error || msg} />
      <div className="tabs">{TABS.map(t => (
        <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t.charAt(0) + t.slice(1).toLowerCase()}
          <span>{t === 'ALL' ? data?.length || 0 : (data || []).filter(a => a.status === t).length}</span></button>))}
      </div>
      <div className="card">
        {loading ? <Empty text="Loading…" /> : !list.length ? <Empty text="Nothing here 🎉" /> : (
          <div className="table-wrap"><table>
            <thead><tr><th>Type</th><th>Reference</th><th>Details</th><th>Amount</th><th>Status</th><th>Decision</th><th /></tr></thead>
            <tbody>{list.map(a => (
              <tr key={a.id}>
                <td><span className="tag">{a.type === 'PURCHASE_ORDER' ? 'PO' : 'REQ'}</span></td>
                <td><b>{a.reference}</b></td>
                <td>{a.details || '—'}</td><td><b>{money(a.amount)}</b></td><td><Badge status={a.status} /></td>
                <td className="small">{a.approver ? <>by {a.approver}<div className="muted">{fmtDate(a.decidedAt)}</div></> : '—'}{a.comments && <div className="muted">“{a.comments}”</div>}</td>
                <td className="row-actions">{a.status === 'PENDING' && <>
                  <button className="btn ok sm" onClick={() => decide(a, 'APPROVED')}><Check size={14} /> Approve</button>
                  <button className="btn bad sm" onClick={() => setRej(a)}><X size={14} /> Reject</button></>}</td>
              </tr>))}</tbody>
          </table></div>
        )}
      </div>
      {rej && (
        <Modal title={`Reject ${rej.reference}`} onClose={() => setRej(null)}>
          <Field label="Reason (optional)"><textarea rows="3" value={comment} onChange={e => setComment(e.target.value)} placeholder="Tell the requester why…" /></Field>
          <div className="modal-foot"><button className="btn ghost" onClick={() => setRej(null)}>Cancel</button><button className="btn bad" onClick={() => decide(rej, 'REJECTED', comment)}>Confirm rejection</button></div>
        </Modal>
      )}
    </>
  )
}
