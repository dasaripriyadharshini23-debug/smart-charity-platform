import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVerifiedCauses } from "../data/causes";
import { matchCauses } from "../utils/matching";

const fieldStyle = {
  display: "block", width: "100%", padding: "12px",
  marginTop: "8px", marginBottom: "20px", boxSizing: "border-box",
};

const FACTOR_LABELS = {
  category: "Category", budget: "Budget", location: "Location",
  urgency: "Urgency", beneficiary: "Beneficiary",
};

function MatchCauses() {
  const navigate = useNavigate();

  const [prefs, setPrefs] = useState({
    category: "", location: "", budget: "", urgency: "", beneficiary: "",
  });
  const [matches, setMatches] = useState([]);
  const [searched, setSearched] = useState(false);

  const update = (field) => (e) =>
    setPrefs((p) => ({ ...p, [field]: e.target.value }));

  const findMatches = () => {
    setMatches(matchCauses(prefs, getVerifiedCauses()));
    setSearched(true);
  };

  return (
    <div style={{ padding: "40px 20px", maxWidth: "1000px", margin: "auto" }}>
      <h1>🎯 Smart Donor–Cause Matching</h1>
      <p>Enter your preferences and we'll rank verified causes for you.</p>

      <div style={{ marginTop: "30px", padding: "25px", border: "1px solid #ddd", borderRadius: "12px" }}>
        <h2>Donor Preferences</h2>

        <label><strong>Cause Category</strong></label>
        <select value={prefs.category} onChange={update("category")} style={fieldStyle}>
          <option value="">No preference</option>
          <option value="Education">Education</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Food">Food</option>
          <option value="Environment">Environment</option>
          <option value="Elderly Care">Elderly Care</option>
        </select>

        <label><strong>Preferred Location</strong></label>
        <input type="text" placeholder="Example: Vellore"
          value={prefs.location} onChange={update("location")} style={fieldStyle} />

        <label><strong>Donation Budget (₹)</strong></label>
        <input type="number" placeholder="Example: 2000"
          value={prefs.budget} onChange={update("budget")} style={fieldStyle} />

        <label><strong>Urgency Preference</strong></label>
        <select value={prefs.urgency} onChange={update("urgency")} style={fieldStyle}>
          <option value="">No preference</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <label><strong>Who would you like to help?</strong></label>
        <select value={prefs.beneficiary} onChange={update("beneficiary")} style={fieldStyle}>
          <option value="">No preference</option>
          <option value="Children">Children</option>
          <option value="Families">Families</option>
          <option value="Elderly">Elderly</option>
          <option value="Patients">Patients</option>
          <option value="Communities">Communities</option>
        </select>

        <button onClick={findMatches}
          style={{ padding: "12px 24px", border: "none", borderRadius: "6px",
                   backgroundColor: "#2563eb", color: "white", cursor: "pointer", fontSize: "16px" }}>
          Find Matching Causes
        </button>
      </div>

      {matches.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h2>✨ Recommended Causes</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {matches.map((cause) => (
              <div key={cause.id}
                style={{ border: "1px solid #ddd", borderRadius: "12px", padding: "20px",
                         boxShadow: "0 3px 8px rgba(0,0,0,0.08)" }}>
                <h3>{cause.name}</h3>
                <p><strong>Match Score:</strong> {cause.matchScore}%</p>

                <div style={{ width: "100%", height: "12px", backgroundColor: "#e5e7eb",
                              borderRadius: "10px", overflow: "hidden", marginBottom: "15px" }}>
                  <div style={{ width: `${cause.matchScore}%`, height: "100%", backgroundColor: "#16a34a" }} />
                </div>

                <p><strong>Category:</strong> {cause.category}</p>
                <p><strong>Location:</strong> {cause.location}</p>
                <p><strong>Urgency:</strong> {cause.urgency}</p>

                <details style={{ marginBottom: "15px" }}>
                  <summary style={{ cursor: "pointer" }}>Why this matched</summary>
                  <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
                    {Object.entries(cause.breakdown)
                      .filter(([, v]) => v !== null)
                      .map(([k, v]) => (
                        <li key={k}>{FACTOR_LABELS[k]}: {Math.round(v * 100)}%</li>
                      ))}
                  </ul>
                </details>

                <button onClick={() => navigate(`/causes/${cause.id}`)}
                  style={{ padding: "10px 18px", border: "none", borderRadius: "6px",
                           backgroundColor: "#2563eb", color: "white", cursor: "pointer" }}>
                  View Cause
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {searched && matches.length === 0 && (
        <p style={{ marginTop: "30px" }}>
          No verified causes matched. Try fewer preferences.
        </p>
      )}
      {!searched && (
        <p style={{ marginTop: "30px" }}>
          Enter your preferences and click <strong>Find Matching Causes</strong>.
        </p>
      )}
    </div>
  );
}

export default MatchCauses;