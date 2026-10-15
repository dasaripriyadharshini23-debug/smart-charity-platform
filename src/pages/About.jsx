function About() {
  return (
    <div className="page-container">

      <div className="page-header">

        <p className="small-title">ABOUT SMARTCHARITY</p>

        <h1>Making Charitable Giving Simpler</h1>

        <p>
          SmartCharity is a cloud-based platform designed to
          connect donors with verified charitable causes.
        </p>

      </div>

      <div className="about-content">

        <div className="about-card">

          <h2>Our Mission</h2>

          <p>
            Our goal is to make charitable giving more convenient,
            transparent and personalized.
          </p>

          <p>
            Instead of requiring donors to search through numerous
            campaigns, SmartCharity can help them discover causes
            based on their interests and preferences.
          </p>

        </div>

        <div className="about-card">

          <h2>Trust & Verification</h2>

          <p>
            Campaigns submitted by charitable organizations can
            go through an administrator verification process before
            becoming available to donors.
          </p>

          <p>
            This creates an additional trust layer between
            organizations and donors.
          </p>

        </div>

      </div>

    </div>
  );
}

export default About;