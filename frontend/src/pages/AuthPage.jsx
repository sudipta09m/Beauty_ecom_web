export default function AuthPage({ mode, onModeChange, onSubmit, message }) {
  return (
    <div className="panel panel--narrow">
      <p className="eyebrow">Account</p>
      <h1 className="panel__hero-title">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
      <p className="panel__copy">
        {mode === "login"
          ? "Login to place orders and use your saved contact and delivery details."
          : "Register with your mobile number, address, city, and email so checkout is connected to a real customer profile."}
      </p>
      <div className="toggle-group">
        <button
          type="button"
          onClick={() => onModeChange("login")}
          className={`toggle-chip${mode === "login" ? " toggle-chip--active" : ""}`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => onModeChange("register")}
          className={`toggle-chip${mode === "register" ? " toggle-chip--active" : ""}`}
        >
          Register
        </button>
      </div>
      <form onSubmit={onSubmit} className="form-stack">
        {mode === "register" ? (
          <>
            <input name="name" placeholder="Full name" className="form-control" />
            <input name="phone" placeholder="Mobile number" className="form-control" />
            <input name="city" placeholder="City" className="form-control" />
            <textarea name="address" rows="4" placeholder="Full address" className="form-control" />
          </>
        ) : null}
        <input name="email" type="email" placeholder="Email" className="form-control" />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="form-control"
        />
        <button type="submit" className="button button--primary button--block">
          {mode === "login" ? "Login" : "Register"}
        </button>
        {message ? <p className="form-message">{message}</p> : null}
      </form>
    </div>
  );
}
