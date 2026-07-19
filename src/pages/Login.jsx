import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-cream d-flex align-items-center justify-content-center px-3">
      <div className="bg-white rounded-4 shadow p-4 p-md-5 animate-floatUp" style={{ maxWidth: "420px", width: "100%" }}>
        <div className="d-flex justify-content-center mb-4"><Logo size={48} /></div>
        <h1 className="h4 fw-semibold text-teal-deep text-center mb-1">Welcome back</h1>
        <p className="text-center text-muted small mb-4">Login to track your orders</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-medium text-teal-deep">Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-control" placeholder="you@example.com" />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-medium text-teal-deep">Password</label>
            <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="form-control" placeholder="••••••••" />
          </div>

          {error && <p className="text-coral small">{error}</p>}

          <button type="submit" disabled={loading} className="btn btn-teal w-100 rounded-pill py-2 fw-semibold">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center small text-muted mt-4">
          New here? <Link to="/signup" className="text-amber-dark fw-semibold text-decoration-none">Create an account</Link>
        </p>
      </div>
    </div>
  );
}