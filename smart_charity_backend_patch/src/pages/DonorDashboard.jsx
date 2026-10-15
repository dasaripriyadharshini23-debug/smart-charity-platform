import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listMyDonations, loadVerifiedCauses } from '../data/cloudCharity';
import '../styles/DonorDashboard.css';

function DonorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [donations, setDonations] = useState([]);
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setError('');
    try {
      const [causeItems, donationItems] = await Promise.all([loadVerifiedCauses(), listMyDonations()]);
      setCauses(causeItems);
      setDonations(donationItems);
    } catch (err) {
      setError(err.message || 'Could not load the dashboard. Please confirm you are signed in with the donor role.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const totalDonated = donations.reduce((sum, donation) => sum + Number(donation.amount ?? 0), 0);
  const causesSupported = new Set(donations.map((donation) => donation.causeId)).size;
  const campaigns = causes.map((cause) => ({ id: cause.id, title: cause.name, category: cause.category, description: cause.description, goal: Number(cause.targetAmount), raised: Number(cause.raisedAmount ?? 0) }));
  const filteredCampaigns = campaigns.filter((campaign) => campaign.title.toLowerCase().includes(search.toLowerCase()) && (category === 'All' || campaign.category === category));

  return <div className="dashboard">
    <header className="dashboard-header"><div><h1>Donor Dashboard</h1><p>Welcome back{user ? `, ${user.name}` : ''}! Find a cause that matters to you.</p></div><button className="profile-button">My Profile</button></header>
    {error && <p role="alert" style={{ color: '#dc2626', margin: '12px 0' }}>{error}</p>}
    <section className="summary-cards"><div className="summary-card"><h3>Total Donated</h3><p>₹{totalDonated.toLocaleString()}</p></div><div className="summary-card"><h3>Causes Supported</h3><p>{causesSupported}</p></div><div className="summary-card"><h3>Total Donations</h3><p>{donations.length}</p></div></section>
    <section className="campaign-section"><div className="section-heading"><div><h2>Find a Cause</h2><p>Support verified campaigns that match your interests.</p></div><button onClick={refresh} disabled={loading}>Refresh</button></div>
      <div className="filters"><input type="text" placeholder="Search for a cause..." value={search} onChange={(e) => setSearch(e.target.value)} /><select value={category} onChange={(e) => setCategory(e.target.value)}><option value="All">All Categories</option><option value="Education">Education</option><option value="Healthcare">Healthcare</option><option value="Food">Food</option><option value="Environment">Environment</option><option value="Elderly Care">Elderly Care</option></select></div>
      {loading ? <p>Loading verified causes from AWS...</p> : <div className="campaign-grid">{filteredCampaigns.map((campaign) => {
        const progress = campaign.goal > 0 ? Math.min((campaign.raised / campaign.goal) * 100, 100) : 0;
        return <div className="campaign-card" key={campaign.id}><div className="campaign-top"><span className="category">{campaign.category}</span><span className="verified">✓ Verified</span></div><h3>{campaign.title}</h3><p>{campaign.description}</p><div className="progress-container"><div className="progress-bar" style={{ width: `${progress}%` }} /></div><div className="campaign-stats"><span>₹{campaign.raised.toLocaleString()}</span><span>of ₹{campaign.goal.toLocaleString()}</span></div><button className="donate-button" onClick={() => navigate(`/causes/${campaign.id}`)}>View Cause</button></div>;
      })}</div>}
    </section>
    <section className="recent-donations"><h2>Recent Donations</h2>{donations.length === 0 ? <p>No donations recorded yet.</p> : donations.slice().reverse().slice(0, 5).map((donation) => <div className="donation-item" key={donation.id}><div><strong>{donation.causeName}</strong><p>{donation.date}</p></div><strong>₹{Number(donation.amount).toLocaleString()}</strong></div>)}
      <button onClick={refresh} style={{ marginTop: 20, padding: '8px 16px', border: 0, borderRadius: 6, background: '#2563eb', color: '#fff', cursor: 'pointer' }}>Refresh Dashboard</button>
    </section>
  </div>;
}

export default DonorDashboard;
