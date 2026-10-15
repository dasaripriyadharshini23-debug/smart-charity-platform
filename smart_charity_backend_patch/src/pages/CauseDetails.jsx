import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadVerifiedCauseById } from '../data/cloudCharity';

function CauseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cause, setCause] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    loadVerifiedCauseById(id)
      .then((item) => { if (active) setCause(item); })
      .catch((err) => { if (active) setError(err.message || 'Could not load this cause.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <div style={{ padding: 40 }}><p>Loading cause...</p></div>;
  if (error || !cause) return <div style={{ padding: 40 }}><h1>Cause Not Found</h1>{error && <p role="alert">{error}</p>}<button onClick={() => navigate('/causes')}>Back to Causes</button></div>;

  const progress = cause.targetAmount > 0 ? Math.min((Number(cause.raisedAmount ?? 0) / Number(cause.targetAmount)) * 100, 100) : 0;
  return <div style={{ padding: 40, maxWidth: 800, margin: 'auto' }}>
    <button onClick={() => navigate('/causes')} style={{ padding: '10px 16px', border: 0, borderRadius: 6, cursor: 'pointer', marginBottom: 25 }}>← Back to Causes</button>
    <h1>{cause.name}</h1><p><strong>Category:</strong> {cause.category}</p><p><strong>Location:</strong> {cause.location}</p><p><strong>Urgency:</strong> {cause.urgency}</p>
    {cause.beneficiary && <p><strong>Helps:</strong> {cause.beneficiary}</p>}
    <hr /><h2>About this Cause</h2><p>{cause.description}</p><h2>Fundraising Progress</h2>
    <p>₹{Number(cause.raisedAmount ?? 0).toLocaleString()} raised of ₹{Number(cause.targetAmount).toLocaleString()}</p>
    <div style={{ width: '100%', height: 20, backgroundColor: '#e5e7eb', borderRadius: 10, overflow: 'hidden' }}><div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#2563eb' }} /></div>
    <p>{Math.round(progress)}% funded</p>
    <button onClick={() => navigate(`/donate/${cause.id}`)} style={{ padding: '12px 24px', border: 0, borderRadius: 6, backgroundColor: '#16a34a', color: '#fff', cursor: 'pointer', fontSize: 16, marginTop: 20 }}>Donate to This Cause</button>
  </div>;
}

export default CauseDetails;
