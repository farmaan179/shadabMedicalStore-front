import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/dashboard/stats").then((res) => setStats(res.data)).catch(() => {});
  }, []);

  if (!stats) return <div className="container py-5">Loading...</div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="fw-semibold text-teal-deep">Admin Dashboard</h2>
        <div className="d-flex gap-2">
          <Link to="/admin/products" className="btn btn-teal rounded-pill">Manage Medicines</Link>
          <Link to="/admin/orders" className="btn btn-outline-teal rounded-pill">Manage Orders</Link>
          <Link to="/admin/messages" className="btn btn-outline-teal rounded-pill">Messages</Link>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card stat-card border-0 shadow-sm rounded-4 p-3">
            <p className="text-muted small mb-1">Total Orders</p>
            <h3 className="text-teal-deep fw-bold">{stats.totalOrders}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stat-card border-0 shadow-sm rounded-4 p-3">
            <p className="text-muted small mb-1">Total Revenue</p>
            <h3 className="text-teal-deep fw-bold">₹{stats.totalRevenue}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stat-card border-0 shadow-sm rounded-4 p-3">
            <p className="text-muted small mb-1">Total Customers</p>
            <h3 className="text-teal-deep fw-bold">{stats.totalCustomers}</h3>
          </div>
        </div>
      </div>

      <div className="card stat-card border-0 shadow-sm rounded-4 p-3 mb-4">
        <h5 className="text-teal-deep mb-3">⚠️ Low Stock (≤ 10 units)</h5>
        {stats.lowStock.length === 0 ? (
          <p className="text-muted small mb-0">All stocked up!</p>
        ) : (
          <ul className="list-unstyled small mb-0">
            {stats.lowStock.map((p) => (
              <li key={p._id} className="d-flex justify-content-between border-bottom py-1">
                <span>{p.name}</span><span className="text-danger fw-semibold">{p.stock} left</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card stat-card border-0 shadow-sm rounded-4 p-3">
        <h5 className="text-teal-deep mb-3">Recent Orders</h5>
        <ul className="list-unstyled small mb-0">
          {stats.recentOrders.map((o) => (
            <li key={o._id} className="d-flex justify-content-between border-bottom py-1">
              <span>{o.customerName} — {o.phone}</span><span>₹{o.totalAmount} · {o.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}