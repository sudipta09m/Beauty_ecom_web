export default function FeedbackPage({ onSubmit, message }) {
  return (
    <div className="panel panel--medium">
      <p className="eyebrow">Feedback</p>
      <h1 className="panel__hero-title">Tell us what to improve</h1>
      <form onSubmit={onSubmit} className="form-stack">
        <input name="name" placeholder="Your name" className="form-control" />
        <input name="email" type="email" placeholder="Email" className="form-control" />
        <textarea
          name="message"
          rows="6"
          placeholder="Share your experience"
          className="form-control"
        />
        <button type="submit" className="button button--primary">
          Send Feedback
        </button>
        {message ? <p className="form-message">{message}</p> : null}
      </form>
    </div>
  );
}
