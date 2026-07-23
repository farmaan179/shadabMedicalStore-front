import { useCart } from "../context/CartContext";
import { Star } from "lucide-react";

export default function ProductCard({ product }) {
  const { addToCart, finalPrice } = useCart();
  const outOfStock = product.stock === 0;
  const hasDiscount = product.discountPercent > 0;
  const discountedPrice = finalPrice(product);

  return (
    <div className="card h-100 border-0 shadow-sm hover-card hover-zoom overflow-hidden rounded-4">
      <div className="ratio ratio-4x3 overflow-hidden position-relative bg-white">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-100 h-100 p-2"
          style={{ objectFit: "contain" }}
        />
        {outOfStock && <span className="badge bg-danger position-absolute top-0 end-0 m-2">Out of Stock</span>}
        {hasDiscount && !outOfStock && (
          <span className="badge bg-amber position-absolute top-0 start-0 m-2">{product.discountPercent}% OFF</span>
        )}
      </div>
      <div className="card-body">
        <span className="text-amber-dark text-uppercase small fw-semibold">{product.category} • {product.type}</span>
        <h3 className="h5 fw-semibold text-teal-deep mt-1">{product.name}</h3>
        <p className="text-muted small">{product.description}</p>

        {product.rating > 0 && (
          <div className="star-rating mb-1">
            {"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}
            <span className="text-muted small ms-1">({product.ratingCount})</span>
          </div>
        )}

        {product.stock > 0 && product.stock <= 10 && <p className="text-warning small mb-1">Only {product.stock} left!</p>}

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            {hasDiscount ? (
              <>
                <span className="mrp-strike me-2">₹{product.price}</span>
                <span className="fw-semibold text-teal-deep">₹{discountedPrice}</span>
              </>
            ) : (
              <span className="fw-semibold text-teal-deep">₹{product.price}</span>
            )}
          </div>
          <button onClick={() => addToCart(product)} disabled={outOfStock} className="btn btn-teal btn-sm rounded-pill px-3">
            {outOfStock ? "Unavailable" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}