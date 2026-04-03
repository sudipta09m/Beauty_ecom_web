import { formatCurrency } from "../lib/currency";

export default function OrderHistoryPage({ orders }) {
  return (
    <div className="stack-md">
      <div>
        <p className="eyebrow">Orders</p>
        <h1 className="page-title">Order history</h1>
      </div>
      <div className="stack-sm">
        {orders.map((order) => (
          <article key={order.id} className="order-card">
            <div className="order-card__row">
              <div>
                <p className="order-card__id">Order #{order.id}</p>
                <p className="order-card__date">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="order-card__summary">
                <p className="order-card__total">{formatCurrency(order.total)}</p>
                <p className="order-card__status">{order.status}</p>
              </div>
            </div>
            {order.customer ? (
              <div className="order-card__details">
                <p className="order-card__detail">
                  <strong>Email:</strong> {order.customer.email}
                </p>
                <p className="order-card__detail">
                  <strong>Phone:</strong> {order.customer.phone}
                </p>
                <p className="order-card__detail">
                  <strong>Address:</strong> {order.customer.address}, {order.customer.city}
                </p>
              </div>
            ) : null}
            {order.items?.length ? (
              <div className="order-card__items">
                {order.items.map((item, index) => (
                  <p key={`${order.id}-${item.productId}-${index}`} className="order-card__detail">
                    <strong>Item:</strong> {item.name || `Product #${item.productId}`} x {item.quantity}
                  </p>
                ))}
              </div>
            ) : null}
          </article>
        ))}
        {!orders.length ? (
          <div className="empty-state">No orders yet.</div>
        ) : null}
      </div>
    </div>
  );
}
