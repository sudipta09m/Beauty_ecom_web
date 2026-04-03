import { Link } from "react-router-dom";
import { formatCurrency } from "../lib/currency";

export default function ProductCard({ product, onAddToCart, badge }) {
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
          <div className="product-card__meta">
            <span>{formatCurrency(product.price)}</span>
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
