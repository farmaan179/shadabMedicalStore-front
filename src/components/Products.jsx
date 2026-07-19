import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import api from "../api/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data)).catch(() => {});
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const filtered = products
    .filter((p) => category === "All" || p.category === category)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <section id="products" className="container py-5">
      <div className="text-center mb-4">
        <span className="text-amber-dark text-uppercase small fw-semibold">Our Shelf</span>
        <h2 className="fw-semibold text-teal-deep mt-1">Medicines & Supplements</h2>
      </div>

      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search medicines..." className="form-control rounded-pill px-4 py-2" />
        </div>
      </div>

      <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
        {categories.map((c) => (
          <button key={c} onClick={() => setCategory(c)} className={`btn btn-sm rounded-pill px-3 fw-semibold ${category === c ? "btn-teal" : "btn-outline-teal"}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="row g-4">
        {filtered.length === 0 && <p className="text-center text-muted">No medicines found.</p>}
        {filtered.map((p) => (
          <div className="col-sm-6 col-lg-4" key={p._id}><ProductCard product={p} /></div>
        ))}
      </div>
    </section>
  );
}