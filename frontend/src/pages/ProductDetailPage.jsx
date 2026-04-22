import { useEffect, useState } from "react";
import { formatCurrency } from "../lib/currency";

export default function ProductDetailPage({ product, onAddToCart }) {
  const gallery = product ? [product.image_path, product.image_path_2, product.image_path_3].filter(Boolean) : [];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id]);

  if (!product) {
    return <div className="empty-state">Product not found.</div>;
  }

  const actualPrice = Number(product.actualPrice ?? product.actual_price ?? product.price);
  const discountPrice = Number(product.discountPrice ?? product.discount_price ?? Math.max(actualPrice - product.price, 0));

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
              {gallery[activeImageIndex] ? (
                <img
                  src={gallery[activeImageIndex]}
                  alt={`${product.name} ${activeImageIndex + 1}`}
                  className="product-gallery__image product-gallery__image--desktop"
                />
              ) : null}
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
          <div className="product-pricing product-pricing--detail">
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
          <div className="product-detail__meta">
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
    </div>
  );
}
