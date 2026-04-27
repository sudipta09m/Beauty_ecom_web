import { useEffect, useState } from "react";
import { formatCurrency } from "../lib/currency";

export default function OrderHistoryPage({ orders, onCancelOrder }) {
  const [openOrderId, setOpenOrderId] = useState(null);
  const [confirmCancelOrderId, setConfirmCancelOrderId] = useState(null);

  useEffect(() => {
    if (!orders.length) {
      setOpenOrderId(null);
      return;
    }

    setOpenOrderId((current) => (orders.some((order) => String(order.id) === String(current)) ? current : orders[0].id));
    setConfirmCancelOrderId((current) =>
      orders.some((order) => String(order.id) === String(current) && order.status?.toLowerCase() === "processing")
        ? current
        : null
    );
  }, [orders]);

  const handleCancelClick = (orderId) => {
    setConfirmCancelOrderId((current) => (String(current) === String(orderId) ? null : orderId));
  };

  const confirmCancelOrder = (orderId) => {
    setConfirmCancelOrderId(null);
    onCancelOrder(orderId);
  };

  return (
    <div className="stack-md">
      <div>
        <p className="eyebrow">Orders</p>
        <h1 className="page-title">Order history</h1>
      </div>
      <div className="stack-sm">
        {orders.map((order) => {
          const isOpen = String(openOrderId) === String(order.id);
          const canCancel = order.status?.toLowerCase() === "processing";

          return (
            <article key={order.id} className={`order-card${isOpen ? " order-card--open" : ""}`}>
              <button
                type="button"
                className="order-card__toggle"
                aria-expanded={isOpen}
                onClick={() => setOpenOrderId(isOpen ? null : order.id)}
              >
                <div>
                  <p className="order-card__id">Order #{order.id}</p>
                  <p className="order-card__date">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="order-card__summary">
                  <p className="order-card__total">{formatCurrency(order.total)}</p>
                  <p className="order-card__status">{order.status}</p>
                  <span className="order-card__chevron">{isOpen ? "Close" : "View"}</span>
                </div>
              </button>

              {isOpen ? (
                <>
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
                  {canCancel ? (
                    <div className="order-card__actions">
                      {String(confirmCancelOrderId) === String(order.id) ? (
                        <div className="order-card__confirm">
                          <p className="order-card__confirm-text">Please recheck before cancelling this order.</p>
                          <div className="order-card__confirm-actions">
                            <button
                              type="button"
                              className="order-card__cancel order-card__cancel--confirm"
                              onClick={() => confirmCancelOrder(order.id)}
                            >
                              Yes, cancel
                            </button>
                            <button
                              type="button"
                              className="order-card__keep"
                              onClick={() => setConfirmCancelOrderId(null)}
                            >
                              Keep order
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="order-card__cancel"
                          onClick={() => handleCancelClick(order.id)}
                        >
                          Cancel order
                        </button>
                      )}
                    </div>
                  ) : null}
                </>
              ) : null}
            </article>
          );
        })}
        {!orders.length ? (
          <div className="empty-state">No orders yet.</div>
        ) : null}
      </div>
    </div>
  );
}
