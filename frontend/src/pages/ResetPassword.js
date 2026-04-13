import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/api";

function ResetPassword() {
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Automatically read token from URL parameters
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setResetToken(token);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Check if token exists
    if (!resetToken) {
      setError("Invalid or missing reset token. Please use the link from your email.");
      setLoading(false);
      return;
    }

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password strength
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const data = await resetPassword(resetToken, newPassword);

      if (data.message === "Password reset successfully") {
        setMessage("✅ Password reset successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError(data.message || "Failed to reset password");
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
            <h2 className="text-dark fw-bold mb-1">🔑 Reset Your Password</h2>
            <p className="text-muted small mt-2">Enter your new password below</p>
            {resetToken && (
              <div className="alert alert-info py-2 small mt-3">
                ✅ Reset token loaded automatically from your email link
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger py-2 small border-0">{error}</div>}
            {message && <div className="alert alert-success py-2 small border-0">{message}</div>}

            <div className="mb-3">
              <label className="form-label small text-muted">New Password</label>
              <input
                type="password"
                className="form-control bg-white text-dark border-light shadow-sm"
                placeholder="Enter new password (min 6 characters)"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoFocus
              />
            </div>

            <div className="mb-4">
              <label className="form-label small text-muted">Confirm New Password</label>
              <input
                type="password"
                className="form-control bg-white text-dark border-light shadow-sm"
                placeholder="Confirm new password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 fw-bold py-2 mb-3"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none" }}
            >
              {loading ? "Resetting..." : "🔑 Reset Password"}
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

export default ResetPassword;