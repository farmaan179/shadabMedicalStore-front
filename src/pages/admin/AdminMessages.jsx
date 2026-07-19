import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/api";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/contact")
      .then((res) => setMessages(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container py-5">
        <h2 className="fw-semibold text-teal-deep mb-4">Customer Messages</h2>

        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : messages.length === 0 ? (
          <p className="text-muted">No messages yet.</p>
        ) : (
          <div className="row g-3">
            {messages.map((m) => (
              <div className="col-md-6" key={m._id}>
                <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-semibold text-teal-deep mb-0">{m.name}</h6>
                    <span className="small text-muted">
                      {new Date(m.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="small mb-1">📞 {m.phone}</p>
                  <p className="small text-muted mb-2">{m.message}</p>
                  
                   <a href={`https://wa.me/91${m.phone.replace(/\D/g, "").slice(-10)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-teal rounded-pill align-self-start"
                  >
                    Reply on WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}