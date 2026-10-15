import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadVerifiedCauseById, recordSimulatedDonation } from '../data/cloudCharity';
import { useAuth } from '../context/AuthContext';

function Donate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cause, setCause] = useState(null);
  const [amount, setAmount] = useState('');
  const [donated, setDonated] = useState(false);
  const [loadingCause, setLoadingCause] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    loadVerifiedCauseById(id)
      .then((item) => { if (active) setCause(item); })
      .catch((err) => { if (active) setError(err.message || 'Could not load the cause.'); })
      .finally(() => { if (active) setLoadingCause(false); });
    return () => { active = false; };
  }, [id]);

  const handleDonation = async () => {
    const value = Number(amount);
    if (!amount || !Number.isFinite(value) || value <= 0) { setError('Please enter a valid donation amount.'); return; }
    if (!user) { navigate('/login'); return; }
    setSaving(true); setError('');
    try {
      await recordSimulatedDonation(cause, value);
      setDonated(true);
    } catch (err) {
      setError(err.message || 'Could not record the donation. Ensure you are signed in with a donor account.');
    } finally { setSaving(false); }
  };

  if (loadingCause) return <div style={{ padding: 40 }}><p>Loading cause...</p></div>;
  if (!cause) return <div style={{ padding: 40 }}><h1>Cause Not Found</h1>{error && <p role="alert">{error}</p>}<button onClick={() => navigate('/causes')}>Back to Causes</button></div>;

  if (donated) return <div style={{ padding: '60px 20px', textAlign: 'center', maxWidth: 700, margin: 'auto' }}>
    <h1>🎉 Thank You!</h1><h2>Donation Recorded</h2><p>You donated ₹{Number(amount).toLocaleString()} to:</p><h3>{cause.name}</h3>
    <p>This is a simulated donation record. No payment was charged or processed.</p>
    <button onClick={() => navigate('/donor-dashboard')} style={{ padding: '12px 24px', border: 0, borderRadius: 6, backgroundColor: '#2563eb', color: '#fff', cursor: 'pointer', marginTop: 20 }}>View My Donations</button>
  </div>;

  return <div style={{ padding: '40px 20px', maxWidth: 600, margin: 'auto' }}>
    <button onClick={() => navigate(`/causes/${cause.id}`)} style={{ padding: '10px 16px', border: 0, borderRadius: 6, cursor: 'pointer', marginBottom: 25 }}>← Back to Cause</button>
    <h1>Donate to {cause.name}</h1><p>{cause.description}</p>
    <div style={{ marginTop: 30, padding: 25, border: '1px solid #ddd', borderRadius: 12 }}>
      <label><strong>Enter Donation Amount (₹)</strong></label>
      <input type="number" min="1" step="1" placeholder="Enter amount in ₹" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ display: 'block', width: '100%', padding: 12, marginTop: 10, marginBottom: 20, boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: 6, fontSize: 16 }} />
      {error && <p role="alert" style={{ color: '#dc2626' }}>{error}</p>}
      <button onClick={handleDonation} disabled={saving} style={{ width: '100%', padding: 14, border: 0, borderRadius: 6, backgroundColor: '#16a34a', color: '#fff', cursor: 'pointer', fontSize: 16 }}>{saving ? 'Recording...' : 'Confirm Simulated Donation'}</button>
    </div>
  </div>;
}

export default Donate;
