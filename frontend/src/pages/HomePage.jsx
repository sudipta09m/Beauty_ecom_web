import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SectionTitle from "../components/SectionTitle";
import { categories } from "../data/products";
import heroImage from "../assets/beauty-hero.svg";

export default function HomePage({ trending, offers, onAddToCart }) {
  return (
    <div className="stack-xl">
      <section className="hero-card">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">New Season Rituals</p>
            <h1 className="hero-title">
              Beauty essentials with a satin-soft luxury feel.
            </h1>
            <p className="hero-copy">
              Discover elevated skincare, polished makeup, silky hair care, indulgent bath products, and signature
              fragrances designed for mobile-first shopping.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="button button--primary">
                Shop All Products
              </Link>
              <Link to="/offers" className="button button--secondary">
                View Offers
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <img
              src={heroImage}
              alt="Luxury beauty hero"
              className="hero-visual__image"
            />
            <div className="hero-visual__card">
              <p className="hero-visual__label">Editor Pick</p>
              <p className="hero-visual__title">Glow with softness, not noise.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionTitle
          eyebrow="Categories"
          title="Shop your ritual"
          copy="Browse the five key beauty categories requested in the build plan."
        />
        <div className="category-grid">
          {categories.slice(1).map((category, index) => (
            <Link
              key={category}
              to={`/products?category=${encodeURIComponent(category)}`}
              className="category-card"
            >
              <p className="category-card__index">0{index + 1}</p>
              <p className="category-card__name">{category}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle eyebrow="Trending" title="Most loved right now" />
        <div className="product-grid">
          {trending.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle eyebrow="Offers" title="Curated savings" />
        <div className="product-grid">
          {offers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              badge={product.offerLabel}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
