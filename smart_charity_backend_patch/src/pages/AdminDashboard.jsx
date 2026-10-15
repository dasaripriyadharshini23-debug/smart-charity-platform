import React, { useCallback, useEffect, useState } from 'react';
import { listMyCauseSubmissions, openSupportingDocument, reviewCause } from '../data/cloudCharity';
import '../styles/AdminDashboard.css';

const CHECKS = ['Supporting document reviewed', 'Registration number checked', 'Contact details confirmed'];

function AdminDashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [selected, setSelected] = useState(null);
  const [checks, setChecks] = useState([false, false, false]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setError('');
    try { setCampaigns(await listMyCauseSubmissions()); }
    catch (err) { setError(err.message || 'Could not load causes. Confirm this account belongs to the admin group.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const openReview = (cause) => { setSelected(cause); setChecks([false, false, false]); setNote(''); };

  const decide = async (status) => {
    if (!selected) return;
    if (status === 'VERIFIED' && !checks.every(Boolean)) { alert('Complete all verification checks before approving.'); return; }
    if (status === 'REJECTED' && !note.trim()) { alert('Please give a reason for rejecting this cause.'); return; }
    setSaving(true); setError('');
    try {
      await reviewCause(selected, status, note);
      setSelected(null);
      await refresh();
      alert(status === 'VERIFIED' ? 'Cause verified and published for donors.' : 'Cause rejected.');
    } catch (err) { setError(err.message || 'Could not save the review.'); }
    finally { setSaving(false); }
  };

  const pending = campaigns.filter((cause) => cause.status === 'PENDING');
  const verified = campaigns.filter((cause) => cause.status === 'VERIFIED');
  const rejected = campaigns.filter((cause) => cause.status === 'REJECTED');

  return <div className="admin-dashboard">
    <header className="admin-header"><div><h1>Admin Dashboard</h1><p>Review and verify submitted causes stored in AWS.</p></div><div className="admin-badge">Administrator</div></header>
    {error && <p role="alert" style={{ color: '#dc2626', margin: '12px 0' }}>{error}</p>}
    <section className="admin-summary">
      <div className="admin-card"><h3>Pending Review</h3><p>{pending.length}</p></div>
      <div className="admin-card"><h3>Verified</h3><p>{verified.length}</p></div>
      <div className="admin-card"><h3>Rejected</h3><p>{rejected.length}</p></div>
      <div className="admin-card"><h3>Total Submitted</h3><p>{campaigns.length}</p></div>
    </section>
    <section className="review-section"><div className="section-title"><div><h2>Causes Pending Verification</h2><p>Review each cause before it becomes available to donors.</p></div><button onClick={refresh} disabled={loading}>Refresh</button></div>
      {loading ? <p>Loading submissions from AWS...</p> : pending.length === 0 ? <div className="empty-state"><h3>No causes pending review</h3><p>All submitted causes have been processed.</p></div> :
        <div className="admin-campaign-grid">{pending.map((cause) => <div className="admin-campaign-card" key={cause.id}>
          <div className="admin-campaign-top"><span className="admin-category">{cause.category}</span><span className="pending-status">Pending</span></div>
          <h3>{cause.name}</h3><p className="collector-name">Submitted by: <strong>{cause.collectorName || cause.collectorEmail || 'Verified account'}</strong></p>
          <p className="campaign-description">{cause.description}</p><div className="campaign-goal"><span>Fundraising Goal</span><strong>₹{cause.targetAmount.toLocaleString()}</strong></div>
          <button className="review-button" onClick={() => openReview(cause)}>Review Cause</button>
        </div>)}</div>}
    </section>
    <section className="processed-section"><h2>Processed Causes</h2><div className="processed-list">
      {campaigns.filter((cause) => cause.status !== 'PENDING').map((cause) => <div className="processed-item" key={cause.id}><div><strong>{cause.name}</strong><p>{cause.category}</p>{cause.adminNote && <p>Note: {cause.adminNote}</p>}</div><span className={cause.status === 'VERIFIED' ? 'verified-status' : 'rejected-status'}>{cause.status === 'VERIFIED' ? 'Verified' : 'Rejected'}</span></div>)}
    </div></section>
    {selected && <div className="modal-overlay"><div className="review-modal">
      <button className="close-modal" onClick={() => setSelected(null)} aria-label="Close review">×</button>
      <span className="admin-category">{selected.category}</span><h2>{selected.name}</h2>
      <p><strong>Submitted by:</strong> {selected.collectorName || selected.collectorEmail || 'Verified account'}</p>
      <p><strong>Location:</strong> {selected.location} &nbsp;|&nbsp; <strong>Helps:</strong> {selected.beneficiary} &nbsp;|&nbsp; <strong>Urgency:</strong> {selected.urgency}</p>
      <p>{selected.description}</p>
      <div className="modal-information"><div><span>Fundraising Goal</span><strong>₹{selected.targetAmount.toLocaleString()}</strong></div><div><span>Registration No.</span><strong>{selected.registrationNumber || 'Not provided'}</strong></div><div><span>Document</span><strong>{selected.documentName || 'None'}</strong></div></div>
      {selected.supportingDocumentKey && <button type="button" onClick={async () => { try { await openSupportingDocument(selected.supportingDocumentKey); } catch (err) { setError(err.message || 'Could not open the document.'); } }}>Open Supporting Document</button>}
      <h3 style={{ marginTop: 20 }}>Verification checklist</h3>
      {CHECKS.map((label, index) => <label key={label} style={{ display: 'block', margin: '6px 0' }}><input type="checkbox" checked={checks[index]} onChange={() => setChecks((old) => old.map((value, i) => i === index ? !value : value))} /> {label}</label>)}
      <textarea placeholder="Admin note (required if rejecting)" value={note} onChange={(e) => setNote(e.target.value)} rows="3" style={{ width: '100%', marginTop: 15, boxSizing: 'border-box', padding: 10 }} />
      <div className="verification-actions"><button className="verify-button" onClick={() => decide('VERIFIED')} disabled={saving}>{saving ? 'Saving...' : 'Verify Cause'}</button><button className="reject-button" onClick={() => decide('REJECTED')} disabled={saving}>{saving ? 'Saving...' : 'Reject Cause'}</button></div>
    </div></div>}
  </div>;
}

export default AdminDashboard;
