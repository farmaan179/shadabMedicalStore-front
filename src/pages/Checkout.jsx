import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function Checkout() {
  const { selectedItems, mrpTotal, finalTotal, totalSavings, clearSelected } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ customerName: user?.name || "", phone: "", address: "" });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const items = selectedItems.map((i) => ({ product: i._id, name: i.name, price: i.price, quantity: i.quantity }));

  const placeCODOrder = async () => {
    await api.post("/orders", { items, ...form, paymentMethod: "COD" });
    clearSelected();
    navigate("/orders");
  };

  const placeOnlineOrder = async () => {
    const { data: razorOrder } = await api.post("/payment/create-order", { amount: finalTotal });
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorOrder.amount,
      currency: "INR",
      name: "Shadab Medical Store",
      description: "Medicine Order Payment",
      order_id: razorOrder.id,
      handler: async function (response) {
        try {
          await api.post("/payment/verify", { ...response, orderData: { items, ...form } });
          clearSelected();
          navigate("/orders");
        } catch (err) {
          setError("Payment verification failed. Please contact support.");
        }
      },
      prefill: { name: form.customerName, contact: form.phone },
      theme: { color: "#0B5351" },
    };
    new window.Razorpay(options).open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!selectedItems.length) return setError("No items selected for checkout.");
    setLoading(true);
    try {
      paymentMethod === "COD" ? await placeCODOrder() : await placeOnlineOrder();
    } catch (err) {
      setError(err.response?.data?.message || "Order failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container py-5">
        <div className="row g-4" style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div className="col-md-7">
            <h2 className="fw-semibold text-teal-deep mb-4">Checkout</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Delivery Address</label>
                <textarea required rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="form-control" />
              </div>

              <div className="mb-4">
                <label className="form-label d-block">Payment Method</label>
                <div className="form-check">
                  <input className="form-check-input" type="radio" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} id="cod" />
                  <label className="form-check-label" htmlFor="cod">Cash on Delivery</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" checked={paymentMethod === "Online"} onChange={() => setPaymentMethod("Online")} id="online" />
                  <label className="form-check-label" htmlFor="online">Pay Online (UPI / Card / Netbanking)</label>
                </div>
              </div>

              {error && <p className="text-danger small">{error}</p>}

              <button type="submit" disabled={loading} className="btn btn-amber w-100 rounded-pill py-2 fw-semibold">
                {loading ? "Processing..." : paymentMethod === "COD" ? "Place Order" : "Pay & Place Order"}
              </button>
            </form>
          </div>

          <div className="col-md-5">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-semibold text-teal-deep mb-3">Order Summary</h5>
              {selectedItems.map((i) => (
                <div key={i._id} className="d-flex justify-content-between small mb-2">
                  <span>{i.name} × {i.quantity}</span>
                  <span>₹{i.price * i.quantity}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between small mb-1"><span>MRP Total</span><span>₹{mrpTotal}</span></div>
              <div className="d-flex justify-content-between small mb-1 text-success"><span>Product Discount</span><span>- ₹{totalSavings}</span></div>
              <div className="d-flex justify-content-between small mb-1"><span>Delivery Fee</span><span className="text-success">FREE</span></div>
              <div className="d-flex justify-content-between small mb-1"><span>Platform Fee</span><span className="text-success">FREE</span></div>
              <hr />
              <div className="d-flex justify-content-between fw-bold text-teal-deep">
                <span>Total Payable</span><span>₹{finalTotal}</span>
              </div>
              {totalSavings > 0 && <p className="small text-success fw-semibold mt-2">You saved a total of ₹{totalSavings}!</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}