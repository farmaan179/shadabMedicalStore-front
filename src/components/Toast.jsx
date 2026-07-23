export default function Toast({ message, type = "success", show }) {
  if (!show) return null;
  const bg = type === "success" ? "bg-teal-deep" : "bg-danger";
  return (
    <div className={`toast-success-custom ${bg} text-white px-4 py-3 rounded-4 shadow-lg`}>
      {message}
    </div>
  );
}