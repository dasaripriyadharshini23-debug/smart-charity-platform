function HowItWorks() {
  return (
    <div className="page-container">

      <div className="page-header">
        <p className="small-title">HOW IT WORKS</p>

        <h1>Simple, Transparent Giving</h1>

        <p>
          SmartCharity helps donors discover verified causes
          and make informed contributions.
        </p>
      </div>

      <div className="process-grid">

        <div className="process-card">
          <div className="process-number">01</div>

          <h2>Create Your Profile</h2>

          <p>
            Register as a donor and tell us about the causes,
            locations and donation preferences that matter to you.
          </p>
        </div>

        <div className="process-card">
          <div className="process-number">02</div>

          <h2>Discover Causes</h2>

          <p>
            Browse verified campaigns or allow our matching
            system to recommend suitable causes.
          </p>
        </div>

        <div className="process-card">
          <div className="process-number">03</div>

          <h2>Review the Cause</h2>

          <p>
            View campaign information, verification status,
            target amount and progress.
          </p>
        </div>

        <div className="process-card">
          <div className="process-number">04</div>

          <h2>Make a Donation</h2>

          <p>
            Select the amount you want to contribute and
            support the cause.
          </p>
        </div>

      </div>

      <div className="matching-explanation">

        <p className="small-title">SMART MATCHING</p>

        <h2>Don't Know Where to Donate?</h2>

        <p>
          That's where SmartCharity's matching system helps.
          Your preferences can be compared with verified campaigns
          to generate personalized recommendations.
        </p>

        <div className="matching-flow">

          <span>Your Preferences</span>

          <strong>→</strong>

          <span>Matching Engine</span>

          <strong>→</strong>

          <span>Recommended Causes</span>

        </div>

      </div>

    </div>
  );
}

export default HowItWorks;