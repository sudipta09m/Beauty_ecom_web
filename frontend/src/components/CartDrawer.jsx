import { formatCurrency } from "../lib/currency";

export default function CartDrawer({ open, items, onClose, onCheckout, onRemoveItem, checkoutLabel, checkoutHint }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={`cart-drawer${open ? " cart-drawer--open" : ""}`}>
      <div className="cart-drawer__overlay" onClick={onClose} />
      <aside className="cart-drawer__panel">
        <div className="cart-drawer__header">
          <h3 className="cart-drawer__title">Your Cart</h3>
          <button type="button" onClick={onClose} className="cart-drawer__close">
            Close
          </button>
        </div>

        <div className="cart-drawer__items">
          {items.length === 0 ? (
            <p className="cart-drawer__empty">Your bag is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-drawer__item">
                <div className="cart-drawer__item-row">
                  <div>
                    <p className="cart-drawer__item-name">{item.name}</p>
                    <p className="cart-drawer__item-meta">
                      {item.quantity} x {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div className="cart-drawer__item-actions">
                    <p className="cart-drawer__item-price">{formatCurrency(item.price * item.quantity)}</p>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="cart-drawer__remove"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-drawer__summary">
          <div className="cart-drawer__summary-row">
            <span>Total</span>
            <span className="cart-drawer__summary-value">{formatCurrency(total)}</span>
          </div>
          {checkoutHint ? <p className="cart-drawer__hint">{checkoutHint}</p> : null}
          <button
            type="button"
            onClick={onCheckout}
            disabled={!items.length}
            className="button button--primary button--block"
          >
            {checkoutLabel}
          </button>
        </div>
      </aside>
    </div>
  );
}
