import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/my").then((res) => setOrders(res.data)).catch(() => {});
  }, []);

  const statusColor = { pending: "warning", confirmed: "info", delivered: "success", cancelled: "danger" };
  const statusMessage = {
    pending: "Your order is pending confirmation.",
    confirmed: "Your order is confirmed and on its way!",
    delivered: "Your order has been delivered. Enjoy!",
    cancelled: "Your order was cancelled.",
  };

  return (
    <div>
      <Navbar />
      <div className="container py-5">
        <h2 className="fw-semibold text-teal-deep mb-4">My Orders</h2>
        {orders.length === 0 ? (
          <p className="text-muted">No orders yet.</p>
        ) : (
          orders.map((o) => (
            <div key={o._id} className="card mb-3 border-0 shadow-sm rounded-4 hover-card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
                  <div>
                    <p className="small text-muted mb-1">Order #{o._id.slice(-6).toUpperCase()}</p>
                    <p className="small text-muted">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`badge bg-${statusColor[o.status] || "secondary"} text-capitalize`}>{o.status}</span>
                </div>

                <p className="small fw-semibold text-teal-deep mb-3">{statusMessage[o.status]}</p>

                {o.items.map((i, idx) => (
                  <div key={idx} className="d-flex gap-3 align-items-center border-bottom py-2">
                    <img src={i.image} alt={i.name} width={50} height={50} style={{ objectFit: "cover", borderRadius: "8px" }} />
                    <div className="flex-grow-1">
                      <p className="small fw-semibold mb-0">{i.name} × {i.quantity}</p>
                      <p className="small text-muted mb-0">{i.description}</p>
                    </div>
                    <span className="small fw-semibold">₹{(i.finalPrice || i.price) * i.quantity}</span>
                  </div>
                ))}

                <div className="mt-3">
                  <div className="d-flex justify-content-between small"><span>MRP Total</span><span>₹{o.mrpTotal || o.totalAmount}</span></div>
                  {o.discountTotal > 0 && <div className="d-flex justify-content-between small text-success"><span>Discount</span><span>- ₹{o.discountTotal}</span></div>}
                  <div className="d-flex justify-content-between fw-semibold text-teal-deep mt-1"><span>Total Paid</span><span>₹{o.totalAmount}</span></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}