import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function Checkout() {
  const { cart, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ customerName: user?.name || "", phone: "", address: "" });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const items = cart.map((i) => ({ product: i._id, name: i.name, price: i.price, quantity: i.quantity }));

  const placeCODOrder = async () => {
    await api.post("/orders", { items, ...form, paymentMethod: "COD" });
    clearCart();
    navigate("/orders");
  };

  const placeOnlineOrder = async () => {
    const { data: razorOrder } = await api.post("/payment/create-order", { amount: totalAmount });

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
          clearCart();
          navigate("/orders");
        } catch (err) {
          setError("Payment verification failed. Please contact support.");
        }
      },
      prefill: { name: form.customerName, contact: form.phone },
      theme: { color: "#0B5351" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!cart.length) return setError("Your cart is empty.");
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
      <div className="container py-5" style={{ maxWidth: "600px" }}>
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

          <div className="d-flex justify-content-between mb-3">
            <span className="fw-semibold">Total Amount</span>
            <span className="fw-bold text-teal-deep">₹{totalAmount}</span>
          </div>

          {error && <p className="text-danger small">{error}</p>}

          <button type="submit" disabled={loading} className="btn btn-amber w-100 rounded-pill py-2 fw-semibold">
            {loading ? "Processing..." : paymentMethod === "COD" ? "Place Order" : "Pay & Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}