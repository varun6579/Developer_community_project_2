import { useState } from "react";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); //  inside component

  const handleLogin = async () => {
    const data = await login({ email, password });

    if (data.token) {
      localStorage.setItem("token", data.token);
      alert("Login successful");
      navigate("/home"); //  redirect
    } else {
      alert(data.message);
    }
  };

  return (
  <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
    <div className="card p-4 shadow" style={{ width: "300px" }}>
      <h3 className="text-center text-success mb-3">Login</h3>

      <input
        className="form-control mb-3"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="form-control mb-3"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} className="btn btn-success w-100">
        Login
      </button>
      <Link to="/signup" className="btn btn-outline-success w-100 mt-2">
        Create Account
      </Link>
    </div>
  </div>
)
};

export default Login;