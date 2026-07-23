import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const load = () => api.get("/orders").then((res) => setOrders(res.data));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this order?")) return;
    await api.delete(`/orders/${id}`);
    load();
  };

  return (
    <div>
      <Navbar />
      <div className="container py-5">
        <h2 className="fw-semibold text-teal-deep mb-4">Manage Orders</h2>

        {orders.map((o) => (
          <div key={o._id} className="card border-0 shadow-sm rounded-4 mb-3 hover-card">
            <div className="card-body">
              <div className="d-flex justify-content-between flex-wrap mb-2">
                <div>
                  <h6 className="fw-semibold text-teal-deep mb-0">{o.customerName}</h6>
                  <p className="small text-muted mb-0">{o.phone} · {new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <div className="d-flex gap-2 align-items-start">
                  <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)} className="form-select form-select-sm">
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button onClick={() => handleDelete(o._id)} className="btn btn-sm btn-outline-danger">Delete</button>
                </div>
              </div>

              {o.items.map((i, idx) => (
                <div key={idx} className="d-flex gap-3 align-items-center border-top pt-2 mt-2">
                  <img src={i.image} alt={i.name} width={45} height={45} style={{ objectFit: "cover", borderRadius: "6px" }} />
                  <div className="flex-grow-1">
                    <p className="small fw-semibold mb-0">{i.name} × {i.quantity}</p>
                    <p className="small text-muted mb-0">{i.description}</p>
                  </div>
                  <span className="small fw-semibold">₹{(i.finalPrice || i.price) * i.quantity}</span>
                </div>
              ))}

              <div className="d-flex justify-content-between mt-2 pt-2 border-top">
                <span className="small">{o.paymentMethod} ({o.paymentStatus})</span>
                <span className="fw-bold text-teal-deep">Total: ₹{o.totalAmount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}