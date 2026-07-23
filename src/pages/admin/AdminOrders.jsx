import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [notifyId, setNotifyId] = useState(null);
  const [etaMinutes, setEtaMinutes] = useState(30);

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

  const buildMessage = (order) => {
    if (order.status === "delivered") {
      return `Hi ${order.customerName}, aapka order Shadab Medical Store se deliver ho chuka hai. Dhanyawad! 🙏`;
    }
    return `Hi ${order.customerName}, aapka order confirm ho gaya hai aur ${etaMinutes} minute mein pahunch jayega. — Shadab Medical Store`;
  };

  const sendWhatsApp = (order) => {
    const cleanPhone = order.phone.replace(/\D/g, "").slice(-10);
    const message = buildMessage(order);
    const url = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setNotifyId(null);
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
                <div className="d-flex gap-2 align-items-start flex-wrap">
                  <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)} className="form-select form-select-sm">
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button onClick={() => setNotifyId(notifyId === o._id ? null : o._id)} className="btn btn-sm btn-outline-teal">
                    Notify
                  </button>
                  <button onClick={() => handleDelete(o._id)} className="btn btn-sm btn-outline-danger">Delete</button>
                </div>
              </div>

              {notifyId === o._id && (
                <div className="bg-cream rounded-3 p-3 mb-2">
                  {o.status !== "delivered" && (
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <label className="small mb-0">Arrives in (minutes):</label>
                      <input
                        type="number"
                        min="1"
                        value={etaMinutes}
                        onChange={(e) => setEtaMinutes(e.target.value)}
                        className="form-control form-control-sm"
                        style={{ maxWidth: "90px" }}
                      />
                    </div>
                  )}
                  <p className="small text-muted mb-2 fst-italic">"{buildMessage(o)}"</p>
                  <div className="d-flex gap-2">
                    <button onClick={() => sendWhatsApp(o)} className="btn btn-sm btn-teal">Send WhatsApp</button>
                    <button onClick={() => setNotifyId(null)} className="btn btn-sm btn-outline-secondary">Cancel</button>
                  </div>
                </div>
              )}

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