import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadVerifiedCauses } from '../data/cloudCharity';

function Causes() {
  const navigate = useNavigate();
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    loadVerifiedCauses()
      .then((items) => { if (active) setCauses(items); })
      .catch((err) => { if (active) setError(err.message || 'Could not load causes. Please sign in and try again.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return <div style={{ padding: 40 }}>
    <h1>Available Causes</h1>
    <p>Explore verified causes and find an opportunity that matches your interests and budget.</p>
    {error && <p role="alert" style={{ color: '#dc2626' }}>{error}</p>}
    {loading ? <p>Loading verified causes...</p> : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 30 }}>
      {causes.map((cause) => <div key={cause.id} style={{ border: '1px solid #ddd', borderRadius: 12, padding: 20, backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}>
        <h2>{cause.name}</h2><p><strong>Category:</strong> {cause.category}</p><p><strong>Location:</strong> {cause.location}</p><p>{cause.description}</p>
        <p><strong>Target:</strong> ₹{Number(cause.targetAmount).toLocaleString()}</p><p><strong>Raised:</strong> ₹{Number(cause.raisedAmount ?? 0).toLocaleString()}</p><p><strong>Urgency:</strong> {cause.urgency}</p>
        <button onClick={() => navigate(`/causes/${cause.id}`)} style={{ padding: '10px 18px', border: 0, borderRadius: 6, backgroundColor: '#2563eb', color: '#fff', cursor: 'pointer' }}>View Cause</button>
      </div>)}
    </div>}
  </div>;
}

export default Causes;
