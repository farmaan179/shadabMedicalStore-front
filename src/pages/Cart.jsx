import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import { Trash2 } from "lucide-react";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalAmount } = useCart();
  const navigate = useNavigate();

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
          <>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr><th>Product</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th></th></tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item._id}>
                      <td className="d-flex align-items-center gap-3">
                        <img src={item.image} alt={item.name} width={50} height={50} style={{ objectFit: "cover", borderRadius: "8px" }} />
                        {item.name}
                      </td>
                      <td>₹{item.price}</td>
                      <td style={{ maxWidth: "100px" }}>
                        <input type="number" min={1} value={item.quantity} onChange={(e) => updateQuantity(item._id, Number(e.target.value))} className="form-control form-control-sm" />
                      </td>
                      <td>₹{item.price * item.quantity}</td>
                      <td><button onClick={() => removeFromCart(item._id)} className="btn btn-sm text-danger"><Trash2 size={18} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-end">
              <div className="text-end">
                <h4 className="text-teal-deep">Total: ₹{totalAmount}</h4>
                <button onClick={() => navigate("/checkout")} className="btn btn-amber rounded-pill px-4 py-2 fw-semibold mt-2">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}