import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/api";

const EMPTY_FORM = {
  name: "", category: "Medicine", type: "Tablet", price: "", stock: "",
  description: "", expiryDate: "", requiresPrescription: false, image: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const loadProducts = () => api.get("/products").then((res) => setProducts(res.data));
  useEffect(() => { loadProducts(); }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("image", file);
    setUploading(true);
    try {
      const res = await api.post("/upload", data, { headers: { "Content-Type": "multipart/form-data" } });
      setForm((f) => ({ ...f, image: res.data.imageUrl }));
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/products/${editId}`, form);
      else await api.post("/products", form);
      setForm(EMPTY_FORM);
      setEditId(null);
      loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save product");
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name, category: p.category, type: p.type || "Tablet", price: p.price,
      stock: p.stock, description: p.description, expiryDate: p.expiryDate?.slice(0, 10) || "",
      requiresPrescription: p.requiresPrescription, image: p.image,
    });
    setEditId(p._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this medicine?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  return (
    <div>
      <Navbar />
      <div className="container py-5">
        <h2 className="fw-semibold text-teal-deep mb-4">Manage Medicines</h2>

        <form onSubmit={handleSubmit} className="card border-0 shadow-sm rounded-4 p-4 mb-5">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small">Medicine Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-control" />
            </div>
            <div className="col-md-3">
              <label className="form-label small">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="form-select">
                <option>Medicine</option><option>Protein</option><option>Supplement</option><option>Devices</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="form-select">
                <option>Tablet</option><option>Syrup</option><option>Injection</option><option>Other</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small">Price (₹)</label>
              <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="form-control" />
            </div>
            <div className="col-md-3">
              <label className="form-label small">Stock Quantity</label>
              <input required type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="form-control" />
            </div>
            <div className="col-md-3">
              <label className="form-label small">Expiry Date</label>
              <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="form-control" />
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" checked={form.requiresPrescription} onChange={(e) => setForm({ ...form, requiresPrescription: e.target.checked })} id="rx" />
                <label className="form-check-label small" htmlFor="rx">Needs Prescription</label>
              </div>
            </div>
            <div className="col-12">
              <label className="form-label small">Description</label>
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="form-control" />
            </div>
            <div className="col-md-6">
              <label className="form-label small">Product Photo</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="form-control" />
              {uploading && <p className="small text-muted mt-1">Uploading...</p>}
              {form.image && <img src={form.image} alt="preview" width={60} height={60} className="mt-2 rounded" style={{ objectFit: "cover" }} />}
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-teal rounded-pill px-4">{editId ? "Update Medicine" : "Add Medicine"}</button>
            {editId && (
              <button type="button" onClick={() => { setForm(EMPTY_FORM); setEditId(null); }} className="btn btn-outline-secondary rounded-pill px-4">
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>Photo</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Expiry</th><th></th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td><img src={p.image} width={40} height={40} style={{ objectFit: "cover", borderRadius: "6px" }} /></td>
                  <td>{p.name}</td>
                  <td>{p.category} / {p.type}</td>
                  <td>₹{p.price}</td>
                  <td className={p.stock <= 10 ? "text-danger fw-semibold" : ""}>{p.stock}</td>
                  <td>{p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : "-"}</td>
                  <td className="d-flex gap-2">
                    <button onClick={() => handleEdit(p)} className="btn btn-sm btn-outline-teal">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="btn btn-sm btn-outline-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}