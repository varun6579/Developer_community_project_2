import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserProfile, getCurrentUser } from "../services/api";

function CompleteProfile() {
  const navigate = useNavigate();
  const [preferredName, setPreferredName] = useState("");
  const [gender, setGender] = useState("male");
  const [role, setRole] = useState("Developer");
  const [organization, setOrganization] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const data = await getCurrentUser();
      if (data && data.user) {
        setUserName(data.user.name || "Developer");
      } else {
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    loadUser();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await updateUserProfile({
        preferredName,
        gender,
        role,
        organization,
        bio
      });

      if (data.user) {
        navigate("/home");
      } else {
        setError(data.message || "Unable to save profile details.");
      }
    } catch (err) {
      setError("Failed to save profile details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light text-dark py-5">
      <div className="card border-0 shadow-lg" style={{ width: "520px", borderRadius: "14px", backgroundColor: "#ffffff" }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-1">Complete Your Profile</h2>
            <p className="text-muted small">Tell the community a bit more about yourself.</p>
          </div>

          {error && <div className="alert alert-danger py-2 small border-0">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small text-muted">Full Name</label>
              <input
                type="text"
                className="form-control bg-white text-dark border-light shadow-sm"
                value={userName}
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="form-label small text-muted">Preferred Display Name</label>
              <input
                type="text"
                className="form-control bg-white text-dark border-light shadow-sm"
                placeholder="What should people call you?"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label small text-muted">Gender</label>
                <select
                  className="form-select bg-white text-dark border-light shadow-sm"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label small text-muted">Role</label>
                <select
                  className="form-select bg-white text-dark border-light shadow-sm"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="Student">Student</option>
                  <option value="Developer">Developer</option>
                  <option value="Professional">Professional</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small text-muted">College or Company</label>
              <input
                type="text"
                className="form-control bg-white text-dark border-light shadow-sm"
                placeholder="e.g. Stanford University or Acme Tech"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label small text-muted">About You</label>
              <textarea
                className="form-control bg-white text-dark border-light shadow-sm"
                rows="4"
                placeholder="A quick intro for other developers"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 fw-bold py-2"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none" }}
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CompleteProfile;
