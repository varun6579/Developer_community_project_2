import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); //  inside

  const navigate = useNavigate();

  const handleSignup = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    console.log("Response:", data); //  ADD THIS

    if (data.message === "User registered successfully") {
      alert("Signup successful");
      navigate("/");
    } else {
      alert(data.message);
    }

  } catch (error) {
    console.log(error);
  }
};
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div className="card p-4 shadow" style={{ width: "300px" }}>
        <h3 className="text-center text-success mb-3">Signup</h3>

        <input
          className="form-control mb-2"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/*  Confirm Password */}
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button onClick={handleSignup} className="btn btn-success w-100">
          Signup
        </button>
      </div>
    </div>
  );
}

export default Signup;