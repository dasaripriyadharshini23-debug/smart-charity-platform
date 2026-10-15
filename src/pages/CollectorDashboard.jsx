import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { listMyCauseSubmissions, submitCause } from '../data/cloudCharity';
import '../styles/CollectorDashboard.css';

const EMPTY_FORM = {
  name: '', category: 'Education', location: '', targetAmount: '',
  urgency: 'Medium', beneficiary: 'Children', description: '', registrationNumber: '',
};

const STATUS_LABEL = { PENDING: 'Under Review', VERIFIED: 'Verified', REJECTED: 'Rejected' };

function CollectorDashboard() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [documentFile, setDocumentFile] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setError('');
    try {
      const items = await listMyCauseSubmissions();
      setCampaigns(items.filter((item) => !user?.email || item.collectorEmail === user.email || item.source === 'aws'));
    } catch (err) {
      setError(err.message || 'Could not load your causes. Make sure this account is in the collector group.');
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => { refresh(); }, [refresh]);

  const handleChange = (e) => setFormData((current) => ({ ...current, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { name, location, targetAmount, description, registrationNumber } = formData;
    if (!name.trim() || !location.trim() || !targetAmount || Number(targetAmount) <= 0 || !description.trim()) {
      setError('Please complete all required fields and enter a goal greater than zero.');
      return;
    }
    if (!registrationNumber.trim() || !documentFile) {
      setError('Enter the organization registration number and choose a supporting document.');
      return;
    }
    setSaving(true);
    try {
      await submitCause({ ...formData, collectorEmail: user?.email, collectorName: user?.name }, documentFile);
      await refresh();
      setFormData(EMPTY_FORM);
      setDocumentFile(null);
      e.target.reset();
      setShowForm(false);
      alert('Cause submitted to AWS for administrator verification.');
    } catch (err) {
      setError(err.message || 'Could not submit the cause. Check your AWS permissions and try again.');
    } finally {
      setSaving(false);
    }
  };

  const totalRaised = campaigns.reduce((sum, cause) => sum + Number(cause.raisedAmount ?? 0), 0);
  const verified = campaigns.filter((cause) => cause.status === 'VERIFIED').length;
  const pending = campaigns.filter((cause) => cause.status === 'PENDING').length;
  const rejected = campaigns.filter((cause) => cause.status === 'REJECTED').length;

  return (
    <div className="collector-dashboard">
      <header className="collector-header">
        <div><h1>Collector Dashboard</h1><p>Create and manage your charity causes.</p></div>
        <button className="create-campaign-button" onClick={() => setShowForm((value) => !value)}>+ Create Cause</button>
      </header>

      {error && <p role="alert" style={{ color: '#dc2626', margin: '12px 0' }}>{error}</p>}

      <section className="collector-summary">
        <div className="collector-card"><h3>Total Raised</h3><p>₹{totalRaised.toLocaleString()}</p></div>
        <div className="collector-card"><h3>Verified Causes</h3><p>{verified}</p></div>
        <div className="collector-card"><h3>Pending Verification</h3><p>{pending}</p></div>
        <div className="collector-card"><h3>Rejected</h3><p>{rejected}</p></div>
      </section>

      {showForm && <section className="create-campaign-section">
        <h2>Create New Cause</h2>
        <p>Provide accurate information. An administrator reviews your cause before donors can see it.</p>
        <form onSubmit={handleSubmit}>
          <label>Cause Title</label><input name="name" value={formData.name} onChange={handleChange} placeholder="Enter cause title" required />
          <label>Category</label><select name="category" value={formData.category} onChange={handleChange}><option>Education</option><option>Healthcare</option><option>Food</option><option>Environment</option><option>Elderly Care</option></select>
          <label>Location</label><input name="location" value={formData.location} onChange={handleChange} placeholder="Example: Vellore" required />
          <label>Fundraising Goal (₹)</label><input type="number" min="1" name="targetAmount" value={formData.targetAmount} onChange={handleChange} placeholder="Enter amount in ₹" required />
          <label>Urgency</label><select name="urgency" value={formData.urgency} onChange={handleChange}><option>High</option><option>Medium</option><option>Low</option></select>
          <label>Who will benefit?</label><select name="beneficiary" value={formData.beneficiary} onChange={handleChange}><option>Children</option><option>Families</option><option>Elderly</option><option>Patients</option><option>Communities</option></select>
          <label>Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows="5" required />
          <label>Organization Registration Number</label><input name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required />
          <label>Supporting Document</label><input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setDocumentFile(e.target.files?.[0] ?? null)} required />
          {documentFile && <p>Selected: {documentFile.name}</p>}
          <button type="submit" className="submit-campaign" disabled={saving}>{saving ? 'Uploading and submitting...' : 'Submit for Verification'}</button>
        </form>
      </section>}

      <section className="my-campaigns">
        <div className="campaign-section-title"><div><h2>My Causes</h2><p>Track your submitted causes.</p></div><button onClick={refresh} disabled={loading}>Refresh</button></div>
        {loading ? <p>Loading causes from AWS...</p> : campaigns.length === 0 ? <p>You haven't submitted any causes yet.</p> :
          <div className="collector-campaign-grid">{campaigns.map((cause) => {
            const progress = cause.targetAmount > 0 ? Math.min((cause.raisedAmount / cause.targetAmount) * 100, 100) : 0;
            return <div className="collector-campaign-card" key={cause.id}>
              <div className="collector-campaign-top"><span className="collector-category">{cause.category}</span><span className={cause.status === 'VERIFIED' ? 'status verified-status' : 'status review-status'}>{STATUS_LABEL[cause.status] ?? cause.status}</span></div>
              <h3>{cause.name}</h3><p>{cause.location}</p>
              <div className="collector-progress"><div className="collector-progress-bar" style={{ width: `${progress}%` }} /></div>
              <div className="collector-funding"><span>₹{cause.raisedAmount.toLocaleString()}</span><span>Goal: ₹{cause.targetAmount.toLocaleString()}</span></div>
              {cause.status === 'REJECTED' && cause.adminNote && <p style={{ color: '#dc2626', marginTop: 10 }}><strong>Admin note:</strong> {cause.adminNote}</p>}
            </div>;
          })}</div>}
      </section>
    </div>
  );
}

export default CollectorDashboard;
