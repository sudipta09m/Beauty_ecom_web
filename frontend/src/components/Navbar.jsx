import { Menu, ShoppingBag, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const links = [
  { to: "/products", label: "All Products" },
  { to: "/offers", label: "Offers" },
  { to: "/feedback", label: "Feedback" },
  { to: "/orders", label: "Order History" },
  { to: "/wholesale", label: "Wholesale Price" }
];

export default function Navbar({ onCartOpen, cartCount, authUser, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const userLabel = authUser?.name ? `Hi, ${authUser.name}` : "Login/Register";

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="site-header">
      <div className="site-header__bar">
        <Link to="/" className="site-brand">
          <div className="site-brand__icon">
            <Sparkles />
          </div>
          <div className="site-brand__copy">
            <p className="site-brand__name">Ur Beauty</p>
            <p className="site-brand__tag">Soft Luxury Beauty</p>
          </div>
        </Link>

        <nav className="site-nav site-nav--desktop">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `site-nav__link${isActive ? " site-nav__link--active" : ""}`}
            >
              {link.label}
            </NavLink>
          ))}
          {authUser ? (
            <>
              <span className="site-user-pill">{userLabel}</span>
              <button type="button" onClick={onLogout} className="site-logout-button">
                Log Out
              </button>
            </>
          ) : (
            <NavLink
              to="/auth"
              className={({ isActive }) => `site-nav__link${isActive ? " site-nav__link--active" : ""}`}
            >
              {userLabel}
            </NavLink>
          )}
        </nav>

        <div className="site-header__actions">
          <button
            type="button"
            onClick={onCartOpen}
            className="site-icon-button"
          >
            <ShoppingBag />
            {cartCount > 0 && (
              <span className="site-icon-button__count">
                {cartCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="site-icon-button site-icon-button--menu"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="site-nav site-nav--mobile">
          <div className="site-nav__mobile-list">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `site-nav__mobile-link${isActive ? " site-nav__mobile-link--active" : ""}`}
              >
                {link.label}
              </NavLink>
            ))}
            {authUser ? (
              <>
                <span className="site-user-pill site-user-pill--mobile">{userLabel}</span>
                <button type="button" onClick={onLogout} className="site-nav__mobile-button">
                  Log Out
                </button>
              </>
            ) : (
              <NavLink
                to="/auth"
                className={({ isActive }) => `site-nav__mobile-link${isActive ? " site-nav__mobile-link--active" : ""}`}
              >
                {userLabel}
              </NavLink>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
