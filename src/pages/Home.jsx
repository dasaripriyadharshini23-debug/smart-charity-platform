import { Link } from "react-router-dom";
import { getCauses, getVerifiedCauses } from "../data/causes";

function Home() {
  const verifiedCount = getVerifiedCauses().length;

  let donations = [];
  try {
    donations = JSON.parse(localStorage.getItem("donations")) || [];
  } catch {
    donations = [];
  }
  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
  const donorCount = new Set(donations.map((d) => d.donorEmail).filter(Boolean)).size;
  const activeCampaigns = getCauses().filter((c) => c.status === "VERIFIED").length;

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">✓ Connecting People With Verified Causes</div>

          <h1>
            Find a Cause.
            <br />
            <span>Make an Impact.</span>
          </h1>

          <p>
            Discover verified causes that match your interests, values, and
            donation preferences. Give with confidence and make every
            contribution meaningful.
          </p>

          <div className="hero-buttons">
            <Link to="/causes" className="primary-btn">Find a Cause →</Link>
            <Link to="/register" className="secondary-btn">Start a Campaign</Link>
          </div>

          <div className="trust-text">
            ✓ Verified Causes &nbsp;&nbsp; ✓ Transparent Donations
          </div>
        </div>

        <div className="hero-card">
          <div className="heart-circle">❤</div>
          <h3>Your contribution can create change.</h3>
          <p>Find causes where your support can make a real difference.</p>

          <div className="impact-row">
            <div>
              <strong>{donorCount}</strong>
              <span>Donors</span>
            </div>
            <div>
              <strong>{verifiedCount}</strong>
              <span>Verified Causes</span>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="section-heading">
          <p className="small-title">EXPLORE</p>
          <h2>Causes That Matter</h2>
          <p>
            Choose an area you care about or let our matching system help you
            discover a suitable cause.
          </p>
        </div>

        <div className="category-grid">
          <div className="category-card">
            <div className="category-icon">📚</div>
            <h3>Education</h3>
            <p>Support learning and educational opportunities.</p>
          </div>
          <div className="category-card">
            <div className="category-icon">🏥</div>
            <h3>Healthcare</h3>
            <p>Help people access essential healthcare.</p>
          </div>
          <div className="category-card">
            <div className="category-icon">🍲</div>
            <h3>Food</h3>
            <p>Help provide food and essential supplies.</p>
          </div>
          <div className="category-card">
            <div className="category-icon">🌱</div>
            <h3>Environment</h3>
            <p>Support projects protecting our environment.</p>
          </div>
          <div className="category-card">
            <div className="category-icon">👵</div>
            <h3>Elderly Care</h3>
            <p>Support essential care for elderly people.</p>
          </div>
        </div>
      </section>

      <section className="how-section">
        <div className="section-heading">
          <p className="small-title">HOW IT WORKS</p>
          <h2>Give With Confidence</h2>
          <p>Our platform makes discovering and supporting verified causes simple.</p>
        </div>

        <div className="steps">
          <div className="step">
            <div className="step-number">01</div>
            <h3>Tell Us What Matters</h3>
            <p>Select your preferred causes, location, budget, and interests.</p>
          </div>
          <div className="step">
            <div className="step-number">02</div>
            <h3>Discover Your Match</h3>
            <p>Our matching system recommends causes based on your preferences.</p>
          </div>
          <div className="step">
            <div className="step-number">03</div>
            <h3>Make an Impact</h3>
            <p>Choose a verified cause and contribute towards something meaningful.</p>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat">
          <strong>₹{totalDonated.toLocaleString()}</strong>
          <span>Total Donations</span>
        </div>
        <div className="stat">
          <strong>{donorCount}</strong>
          <span>Active Donors</span>
        </div>
        <div className="stat">
          <strong>{verifiedCount}</strong>
          <span>Verified Causes</span>
        </div>
        <div className="stat">
          <strong>{activeCampaigns}</strong>
          <span>Active Campaigns</span>
        </div>
      </section>

      <section className="cta-section">
        <div>
          <p className="small-title">MAKE A DIFFERENCE</p>
          <h2>Every contribution can create meaningful change.</h2>
          <p>
            Whether you know exactly what you want to support or need help
            discovering a cause, SmartCharity is here to help.
          </p>
          <Link to="/register" className="cta-button">Get Started →</Link>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-brand">
          <div className="logo">
            <span className="logo-icon">❤</span>
            Smart<span>Charity</span>
          </div>
          <p>
            Connecting donors with verified causes to make charitable giving
            simpler and more meaningful.
          </p>
        </div>

        <div className="footer-column">
          <h4>Platform</h4>
          <Link to="/causes">Explore Causes</Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/login">For Donors</Link>
          <Link to="/register">For Organizations</Link>
        </div>

        <div className="footer-column">
          <h4>Support</h4>
          <Link to="/about">About Us</Link>
          <Link to="/about">Contact Us</Link>
          <Link to="/about">Privacy</Link>
          <Link to="/about">Terms</Link>
        </div>
      </footer>
    </>
  );
}

export default Home;