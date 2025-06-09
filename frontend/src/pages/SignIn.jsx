import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function SignIn() {
  const l = useLocation();
  const un = l.state?.un || "";
  const pw = l.state?.pw || "";

  const [username, setUsername] = useState(un);
  const [password, setPassword] = useState(pw);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { signIn } = useAuth();

  const destination = l.state?.from || "/home";
  const message = l.state?.message;

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await loginUser(username, password);
      if (response.user_id >= 0) {
        signIn({ username: username, user_id: response.user_id });
        navigate(destination, { replace: true });
      } else if (response.detail === "Invalid credentials.") {
        setError("Invalid login credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid login credentials");
    }
  };

  return (
    <div className="signin-container">
      {/* Bankish logo in the top-left corner */}
      <Link to="/" className="bankish-logo">
        Bank<span>ish</span>
      </Link>

      {message && <div className="alert alert-info text-red-500 text-sm">{message}</div>}

      {/* Sign in form */}
      <div className="signin-form">
        <form onSubmit={handleSignIn}>
          <h2>Welcome Back</h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Sign In</button>

          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}