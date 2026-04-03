import { useEffect, useState } from "react";
import { formatCurrency } from "../lib/currency";

export default function ProductDetailPage({ product, onAddToCart, onReviewSubmit }) {
  if (!product) {
    return <div className="empty-state">Product not found.</div>;
  }

  const gallery = [product.image_path, product.image_path_2, product.image_path_3].filter(Boolean);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product.id]);

  const showPreviousImage = () => {
    setActiveImageIndex((current) => (current === 0 ? gallery.length - 1 : current - 1));
  };

  const showNextImage = () => {
    setActiveImageIndex((current) => (current === gallery.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="stack-lg">
      <section className="product-detail-grid">
        <>
          <div className="product-gallery product-gallery--mobile">
            {gallery.map((image, index) => (
              <img
                key={`${product.id}-mobile-${index}`}
                src={image}
                alt={`${product.name} ${index + 1}`}
                className="product-gallery__image"
              />
            ))}
          </div>

          <div className="product-gallery product-gallery--desktop">
            <div className="product-gallery__stage">
              <img
                src={gallery[activeImageIndex]}
                alt={`${product.name} ${activeImageIndex + 1}`}
                className="product-gallery__image product-gallery__image--desktop"
              />
              {gallery.length > 1 ? (
                <div className="product-gallery__controls">
                  <button type="button" onClick={showPreviousImage} className="product-gallery__button">
                    Prev
                  </button>
                  <span className="product-gallery__counter">
                    {activeImageIndex + 1} / {gallery.length}
                  </span>
                  <button type="button" onClick={showNextImage} className="product-gallery__button">
                    Next
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </>

        <div className="panel panel--large">
          <p className="eyebrow">{product.category}</p>
          <h1 className="product-detail__title">{product.name}</h1>
          <div className="product-detail__meta">
            <span className="product-detail__price">{formatCurrency(product.price)}</span>
            <span>{product.rating} stars</span>
          </div>
          <p className="product-detail__description">{product.description}</p>
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="button button--primary"
          >
            Add to Cart
          </button>
        </div>
      </section>

      <section className="review-grid">
        <div className="panel">
          <h2 className="panel__title">Reviews</h2>
          <div className="review-list">
            {(product.reviews || []).map((review) => (
              <article key={review.id} className="review-card">
                <div className="review-card__header">
                  <p className="review-card__name">{review.userName}</p>
                  <p className="review-card__rating">{review.rating} stars</p>
                </div>
                <p className="review-card__copy">{review.comment}</p>
              </article>
            ))}
          </div>
        </div>

        <form onSubmit={onReviewSubmit} className="panel">
          <h2 className="panel__title">Leave a Review</h2>
          <div className="form-stack">
            <input name="userName" placeholder="Your name" className="form-control" />
            <select name="rating" className="form-control">
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
              <option value="3">3 stars</option>
            </select>
            <textarea
              name="comment"
              rows="5"
              placeholder="Share your experience"
              className="form-control"
            />
            <button type="submit" className="button button--primary">
              Submit Review
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
