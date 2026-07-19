export default function Hero() {
  return (
    <section id="home" className="bg-teal-deep text-white py-5 py-md-6 position-relative overflow-hidden">
      <div className="container position-relative py-4">
        <div className="row align-items-center g-5">
          <div className="col-md-6 animate-floatUp">
            <span className="badge rounded-pill bg-white bg-opacity-10 text-amber-dark px-3 py-2 mb-3 text-uppercase small">
              Trusted Neighbourhood Pharmacy
            </span>
            <h1 className="display-5 fw-semibold mb-3">
              Health, delivered with care —{" "}
              <span className="fst-italic" style={{ color: "var(--amber)" }}>the Shadab way</span>
            </h1>
            <p className="fs-5 mb-4" style={{ color: "var(--teal-soft)" }}>
              Genuine medicines, protein & wellness supplements, and a pharmacist
              who actually picks up the phone. Order online, we'll handle the rest.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <a href="#products" className="btn btn-amber rounded-pill px-4 py-2 fw-semibold">Browse Medicines</a>
              <a href="#contact" className="btn btn-outline-light rounded-pill px-4 py-2 fw-semibold">Order via Call/Form</a>
            </div>
          </div>

          <div className="col-md-6 animate-floatUp">
            <div className="ratio ratio-1x1 bg-white bg-opacity-10 rounded-4 border border-white border-opacity-25 d-flex align-items-center justify-content-center">
              <svg viewBox="0 0 200 200" style={{ width: "70%", height: "70%" }}>
                <circle cx="100" cy="100" r="90" fill="#8FC1B5" opacity="0.15" />
                <rect x="85" y="40" width="30" height="120" rx="8" fill="#F2A65A" />
                <rect x="40" y="85" width="120" height="30" rx="8" fill="#F2A65A" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}