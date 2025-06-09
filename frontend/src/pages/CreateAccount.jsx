import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function CreateAccount() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation logic
    if (form.username.length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }

    if (form.password.length < 10) {
      setError("Password must be at least 10 characters long.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");

    try {
      const response = await registerUser({
        username: form.username,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
      });

      if (!response.user_id) {
        setError("Username or email already exists.");
      } else {
        navigate("/sign-in", { state: { un: form.username, pw: form.password } });
      }
    } catch (err) {
      console.error(err);
      setError("Username or email already exists.");
    }
  };

  return (
    <div className="create-account-container"> {/* Page container */}
      <Link to="/" className="create-account-logo">
        Bank<span>ish</span>
      </Link>

      <div className="create-account-form-container"> {/* Form container */}
        <h2 style={{ color: "#2b2c2e", textAlign: "center", marginBottom: "20px" }}>
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="create-account-form">
          <div>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            {error && <p className="error-message">{error}</p>}
          </div>

          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}