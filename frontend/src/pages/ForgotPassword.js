import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await forgotPassword(email);

      if (data.message === "Password reset token generated") {
        // Automatically redirect to reset password page with token
        if (data.resetToken) {
          navigate(`/reset-password?token=${data.resetToken}`);
        } else {
          setMessage("✅ Password reset link generated! Check your email for the reset link.");
        }
      } else {
        setError(data.message || "Failed to send reset email");
      }
    } catch (err) {
      setError("Server connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light text-dark">
      <div className="card border-0 shadow-lg" style={{ width: "420px", borderRadius: "10px", backgroundColor: "#ffffff" }}>

        <div className="card-body p-5">
          <div className="text-center mb-5">
            <h2 className="text-dark fw-bold mb-1">🔐 Reset Password</h2>
            <p className="text-muted small mt-2">Enter your email to receive password reset instructions</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger py-2 small border-0">{error}</div>}
            {message && <div className="alert alert-success py-2 small border-0">{message}</div>}

            <div className="mb-4">
              <label className="form-label small text-muted">Email Address</label>
              <input
                type="email"
                className="form-control bg-white text-dark border-light shadow-sm"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 fw-bold py-2 mb-3"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none" }}
            >
              {loading ? "Sending..." : "📧 Send Reset Instructions"}
            </button>

            <Link to="/" className="btn w-100 btn-outline-secondary d-block text-center text-decoration-none rounded-pill small" style={{ fontSize: "0.85rem" }}>
              ← Back to Login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;