import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="label-kicker">404</div>
      <h1 className="mt-2 font-display text-5xl md:text-6xl font-semibold" style={{ color: "var(--mm-navy)" }}>
        Page not found
      </h1>
      <p className="mt-4 text-slate-600">That page doesn't exist. Let's get you home.</p>
      <Link to="/" className="mm-btn-primary mt-8 inline-flex" data-testid="notfound-home-btn">Go home</Link>
    </div>
  );
}
