import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/my").then((res) => setOrders(res.data)).catch(() => {});
  }, []);

  const statusColor = { pending: "warning", confirmed: "info", delivered: "success", cancelled: "danger" };

  return (
    <div>
      <Navbar />
      <div className="container py-5">
        <h2 className="fw-semibold text-teal-deep mb-4">My Orders</h2>
        {orders.length === 0 ? (
          <p className="text-muted">No orders yet.</p>
        ) : (
          orders.map((o) => (
            <div key={o._id} className="card mb-3 border-0 shadow-sm rounded-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start flex-wrap">
                  <div>
                    <p className="small text-muted mb-1">Order #{o._id.slice(-6).toUpperCase()}</p>
                    <p className="small text-muted">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`badge bg-${statusColor[o.status] || "secondary"} text-capitalize`}>{o.status}</span>
                </div>
                <ul className="list-unstyled small mb-2">
                  {o.items.map((i, idx) => <li key={idx}>{i.name} × {i.quantity} — ₹{i.price * i.quantity}</li>)}
                </ul>
                <p className="fw-semibold text-teal-deep mb-0">Total: ₹{o.totalAmount}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}