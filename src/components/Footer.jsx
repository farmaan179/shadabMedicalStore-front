import Logo from "./Logo";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--ink)", color: "#ffffffb3" }}>
      <div className="container py-5 row g-4">
        <div className="col-md-4">
          <Logo size={38} />
          <p className="small mt-3">Your neighbourhood medical store for genuine medicines, protein supplements, and honest advice.</p>
        </div>
        <div className="col-md-4">
          <h6 className="text-white fw-semibold mb-3">Quick Links</h6>
          <ul className="list-unstyled small">
            <li><a href="#home" className="link-light text-decoration-none">Home</a></li>
            <li><a href="#products" className="link-light text-decoration-none">Medicines</a></li>
            <li><a href="#contact" className="link-light text-decoration-none">Contact</a></li>
          </ul>
        </div>
        <div className="col-md-4">
          <h6 className="text-white fw-semibold mb-3">Visit Us</h6>
          <p className="small mb-1">Open Mon–Sun, 8:00 AM – 11:00 PM</p>
          <p className="small">Call: +91 8384836809</p>
        </div>
      </div>
      <div className="text-center small py-3 border-top border-secondary">
        © {new Date().getFullYear()} Shadab Medical Store. All rights reserved.
      </div>
    </footer>
  );
}