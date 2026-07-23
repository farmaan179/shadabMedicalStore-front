import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Trash2 } from "lucide-react";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, toggleSelect, mrpTotal, finalTotal, totalSavings, finalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div>
      <Navbar />
      <div className="container py-5">
        <h2 className="fw-semibold text-teal-deep mb-4">Your Cart</h2>

        {cart.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">Your cart is empty.</p>
            <Link to="/#products" className="btn btn-teal rounded-pill px-4">Browse Medicines</Link>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              {cart.map((item) => (
                <div key={item._id} className="card border-0 shadow-sm rounded-4 mb-3 hover-card">
                  <div className="card-body d-flex gap-3 align-items-center">
                    <input
                      type="checkbox"
                      checked={!!item.selected}
                      onChange={() => toggleSelect(item._id)}
                      className="form-check-input"
                    />
                    <img src={item.image} alt={item.name} width={70} height={70} style={{ objectFit: "cover", borderRadius: "10px" }} />
                    <div className="flex-grow-1">
                      <h6 className="fw-semibold text-teal-deep mb-1">{item.name}</h6>
                      <p className="small text-muted mb-1" style={{ maxWidth: "300px" }}>{item.description}</p>
                      <div className="d-flex align-items-center gap-2">
                        {item.discountPercent > 0 && <span className="mrp-strike">₹{item.price}</span>}
                        <span className="fw-semibold text-teal-deep">₹{finalPrice(item)}</span>
                        {item.discountPercent > 0 && <span className="badge bg-amber">{item.discountPercent}% OFF</span>}
                      </div>
                    </div>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                      className="form-control form-control-sm"
                      style={{ width: "70px" }}
                    />
                    <button onClick={() => removeFromCart(item._id)} className="btn btn-sm text-danger">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: "90px" }}>
                <h5 className="fw-semibold text-teal-deep mb-3">Price Details</h5>
                <div className="d-flex justify-content-between small mb-2">
                  <span>MRP Total</span><span>₹{mrpTotal}</span>
                </div>
                <div className="d-flex justify-content-between small mb-2 text-success">
                  <span>Discount</span><span>- ₹{mrpTotal - finalTotal}</span>
                </div>
                <div className="d-flex justify-content-between small mb-2">
                  <span>Delivery Fee</span><span className="text-success">FREE</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold text-teal-deep mb-2">
                  <span>Total Payable</span><span>₹{finalTotal}</span>
                </div>
                {totalSavings > 0 && (
                  <p className="small text-success fw-semibold">You saved a total of ₹{totalSavings}!</p>
                )}
                <button
                  onClick={handleCheckout}
                  disabled={!cart.some((i) => i.selected)}
                  className="btn btn-amber rounded-pill py-2 fw-semibold mt-3"
                >
                  Proceed to Checkout
                </button>
                {!user && <p className="small text-muted mt-2 text-center">You'll be asked to login first</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}