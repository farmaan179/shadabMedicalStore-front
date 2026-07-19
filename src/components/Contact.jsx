import { useState } from "react";
import api from "../api/api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.post("/contact", form);
      setStatus("sent");
      setForm({ name: "", phone: "", message: "" });
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="bg-teal-deep text-white py-5">
      <div className="container">
        <div className="text-center mb-5">
          <span
            className="text-uppercase small fw-semibold"
            style={{ color: "var(--amber)" }}
          >
            Get in Touch
          </span>
          <h2 className="fw-semibold mt-1">
            Order Medicines or Ask a Question
          </h2>
        </div>

        <div className="row g-4">
          <div className="col-md-6">
            <form
              onSubmit={handleSubmit}
              className="bg-white bg-opacity-10 border border-white border-opacity-25 rounded-4 p-4 h-100"
            >
              <div className="mb-3">
                <label
                  className="form-label small"
                  style={{ color: "var(--teal-soft)" }}
                >
                  Your Name
                </label>
                <input
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="form-control bg-transparent text-white"
                />
              </div>
              <div className="mb-3">
                <label
                  className="form-label small"
                  style={{ color: "var(--teal-soft)" }}
                >
                  Phone Number
                </label>
                <input
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  className="form-control bg-transparent text-white"
                />
              </div>
              <div className="mb-3">
                <label
                  className="form-label small"
                  style={{ color: "var(--teal-soft)" }}
                >
                  What do you need?
                </label>
                <textarea
                  name="message"
                  required
                  rows={3}
                  value={form.message}
                  onChange={handleChange}
                  className="form-control bg-transparent text-white"
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="btn btn-amber rounded-pill px-4 py-2 fw-semibold"
              >
                {status === "sending" ? "Sending..." : "Send Request"}
              </button>
              {status === "sent" && (
                <p className="mt-3" style={{ color: "var(--teal-soft)" }}>
                  Thanks! We'll call you back shortly.
                </p>
              )}
              {status === "error" && (
                <p className="mt-3 text-coral">
                  Something went wrong. Try again.
                </p>
              )}
            </form>
          </div>

          <div className="col-md-6">
            <div className="bg-white bg-opacity-10 border border-white border-opacity-25 rounded-4 p-4 h-100">
              <h5 className="mb-3">Visit Our Store</h5>
              <p className="small mb-1">
                📍 Eid Gah ki Pulia, Bye Pass Road, Quarsi, Aligarh 202002
              </p>
              <p className="small mb-1">📧 shadabkhan0531@gmail.com</p>
              <p className="small mb-3">📞 +91 83848 36809</p>

              <div className="ratio ratio-16x9 rounded-3 overflow-hidden">
                <iframe
                  title="Store Location"
                  src="https://www.google.com/maps?q=Shadab+Medical+Store,27.9137451,78.0975735&z=17&output=embed"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>

              
                <a href="https://www.google.com/maps/place/Shadab+Madikal+Store/@27.9137451,78.0975735,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-light rounded-pill mt-3"
              >
                Get Directions →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}