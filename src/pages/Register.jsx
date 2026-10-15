import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signUp,
  confirmSignUp,
  resendSignUpCode,
} from "aws-amplify/auth";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("register");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    setLoading(true);

    try {
      const result = await signUp({
        username: email.trim(),
        password,
        options: {
          userAttributes: {
            email: email.trim(),
            name: name.trim(),
          },
        },
      });

      if (result.isSignUpComplete) {
        setStep("complete");
        setMessage("Your account has been created.");
      } else {
        setStep("verify");
        setMessage("Check your email for the verification code.");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await confirmSignUp({
        username: email.trim(),
        confirmationCode: code.trim(),
      });

      if (result.isSignUpComplete) {
        setStep("complete");
        setMessage("Email verified! Your account is ready.");
      } else {
        setMessage(
          "Additional verification is required. Please follow the instructions."
        );
      }
    } catch (err) {
      setError(err.message || "Verification failed. Check the code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await resendSignUpCode({ username: email.trim() });
      setMessage("A new verification code has been sent.");
    } catch (err) {
      setError(err.message || "Could not resend the verification code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">✦ SmartCharity</div>

        {step === "register" && (
          <>
            <h1>Create Your Account</h1>
            <p>Join SmartCharity and make a difference.</p>

            <form onSubmit={handleRegister}>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label>Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                autoComplete="new-password"
                required
              />

              <p>
                Your account access will be assigned according to your role.
                Charity accounts may require administrator approval.
              </p>

              <button type="submit" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </>
        )}

        {step === "verify" && (
          <>
            <h1>Verify Your Email</h1>
            <p>
              Enter the verification code sent to <strong>{email}</strong>.
            </p>

            <form onSubmit={handleVerify}>
              <label>Verification Code</label>
              <input
                type="text"
                placeholder="Enter the code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </form>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={loading}
            >
              Resend Verification Code
            </button>
          </>
        )}

        {step === "complete" && (
          <>
            <h1>Registration Successful</h1>
            <p>Your account registration is complete.</p>
            <button onClick={() => navigate("/login")}>
              Go to Login
            </button>
          </>
        )}

        {message && <p role="status">{message}</p>}

        {error && (
          <p role="alert" style={{ color: "red" }}>
            {error}
          </p>
        )}

        {step === "register" && (
          <p className="auth-bottom">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default Register;