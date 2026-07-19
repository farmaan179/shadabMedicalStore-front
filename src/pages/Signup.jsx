import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", form);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-cream d-flex align-items-center justify-content-center px-3 py-5">
      <div className="bg-white rounded-4 shadow p-4 p-md-5 animate-floatUp" style={{ maxWidth: "420px", width: "100%" }}>
        <div className="d-flex justify-content-center mb-4"><Logo size={48} /></div>
        <h1 className="h4 fw-semibold text-teal-deep text-center mb-1">Create your account</h1>
        <p className="text-center text-muted small mb-4">Order faster, track history</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-medium text-teal-deep">Full Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-control" placeholder="Ayesha Khan" />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-medium text-teal-deep">Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-control" placeholder="you@example.com" />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-medium text-teal-deep">Phone</label>
            <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="form-control" placeholder="98765 43210" />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-medium text-teal-deep">Password</label>
            <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="form-control" placeholder="At least 6 characters" />
          </div>

          {error && <p className="text-coral small">{error}</p>}

          <button type="submit" disabled={loading} className="btn btn-amber w-100 rounded-pill py-2 fw-semibold">
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center small text-muted mt-4">
          Already have an account? <Link to="/login" className="text-amber-dark fw-semibold text-decoration-none">Login</Link>
        </p>
      </div>
    </div>
  );
}