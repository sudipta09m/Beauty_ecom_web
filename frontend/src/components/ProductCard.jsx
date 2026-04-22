import { Link } from "react-router-dom";
import { formatCurrency } from "../lib/currency";

export default function ProductCard({ product, onAddToCart, badge }) {
  const actualPrice = Number(product.actualPrice ?? product.actual_price ?? product.price);
  const discountPrice = Number(product.discountPrice ?? product.discount_price ?? Math.max(actualPrice - product.price, 0));

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card__media-link">
        <div className="product-card__media">
          {badge ? (
            <span className="product-card__badge">
              {badge}
            </span>
          ) : null}
          <img
            src={product.image_path}
            alt={product.name}
            loading="lazy"
            className="product-card__image"
          />
        </div>
      </Link>
      <div className="product-card__body">
        <div className="product-card__content">
          <p className="product-card__category">{product.category}</p>
          <Link to={`/products/${product.id}`} className="product-card__title">
            {product.name}
          </Link>
          <div className="product-pricing product-pricing--card">
            <p>
              <span>Actual price</span>
              <strong className="product-pricing__actual">{formatCurrency(actualPrice)}</strong>
            </p>
            <p>
              <span>Discount</span>
              <strong>{formatCurrency(discountPrice)}</strong>
            </p>
            <p>
              <span>After discount</span>
              <strong className="product-pricing__final">{formatCurrency(product.price)}</strong>
            </p>
          </div>
          <div className="product-card__meta">
            <span>{product.rating} stars</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className="button button--primary button--block"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
