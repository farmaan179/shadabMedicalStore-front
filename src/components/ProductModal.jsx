import { useState } from "react";
import { X } from "lucide-react";

export default function ProductModal({ product, onClose, onAddToCart }) {
  const images = product.images?.length ? product.images : [product.image];
  const [activeImg, setActiveImg] = useState(images[0]);

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.6)", zIndex: 2000 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-4 shadow-lg overflow-hidden"
        style={{ maxWidth: "800px", width: "92%", maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-end p-2">
          <button onClick={onClose} className="btn btn-sm">
            <X size={20} />
          </button>
        </div>

        <div className="row g-0 px-3 pb-4">
          <div className="col-md-6">
            <div className="ratio ratio-1x1 bg-white border rounded-3 mb-2 d-flex align-items-center justify-content-center">
              <img src={activeImg} alt={product.name} className="w-100 h-100 p-3" style={{ objectFit: "contain" }} />
            </div>
            {images.length > 1 && (
              <div className="d-flex gap-2 flex-wrap justify-content-center">
                {images.map((img) => (
                  <img
                    key={img}
                    src={img}
                    onClick={() => setActiveImg(img)}
                    width={60}
                    height={60}
                    className={`rounded border ${activeImg === img ? "border-teal-deep border-2" : ""}`}
                    style={{ objectFit: "cover", cursor: "pointer" }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="col-md-6 ps-md-4 pt-3 pt-md-0">
            <span className="text-amber-dark text-uppercase small fw-semibold">{product.category} • {product.type}</span>
            <h3 className="h4 fw-semibold text-teal-deep mt-1">{product.name}</h3>
            <p className="text-muted">{product.description}</p>

            {product.rating > 0 && (
              <div className="star-rating mb-2">
                {"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}
                <span className="text-muted small ms-1">({product.ratingCount})</span>
              </div>
            )}

            <div className="mb-3">
              {product.discountPercent > 0 ? (
                <>
                  <span className="mrp-strike me-2 fs-6">₹{product.price}</span>
                  <span className="fw-bold text-teal-deep fs-4">
                    ₹{Math.round(product.price - (product.price * product.discountPercent) / 100)}
                  </span>
                  <span className="badge bg-amber ms-2">{product.discountPercent}% OFF</span>
                </>
              ) : (
                <span className="fw-bold text-teal-deep fs-4">₹{product.price}</span>
              )}
            </div>

            <button
              onClick={() => { onAddToCart(product); onClose(); }}
              disabled={product.stock === 0}
              className="btn btn-teal rounded-pill px-4 py-2 fw-semibold"
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}