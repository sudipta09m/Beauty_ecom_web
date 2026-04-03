export default function WholesalePage({ onSubmit, message }) {
  return (
    <div className="split-layout">
      <section className="panel panel--large">
        <p className="eyebrow">Wholesale</p>
        <h1 className="panel__hero-title">Partner with Ur Beauty</h1>
        <p className="panel__copy">
          Share your details for bulk pricing, curated bundles, and stock support for salons, boutiques, and resellers.
        </p>
      </section>

      <form onSubmit={onSubmit} className="panel panel--large">
        <div className="form-stack">
          <input name="name" placeholder="Full name" className="form-control" />
          <input name="email" type="email" placeholder="Email" className="form-control" />
          <input name="phone" placeholder="Phone number" className="form-control" />
          <textarea
            name="address"
            rows="5"
            placeholder="Business address"
            className="form-control"
          />
          <button type="submit" className="button button--primary">
            Request Wholesale Pricing
          </button>
          {message ? <p className="form-message">{message}</p> : null}
        </div>
      </form>
    </div>
  );
}
