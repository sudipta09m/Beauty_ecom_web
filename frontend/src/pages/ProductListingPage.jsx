import ProductCard from "../components/ProductCard";
import SearchFilters from "../components/SearchFilters";
import SectionTitle from "../components/SectionTitle";

export default function ProductListingPage({ products, filters, onFilterChange, onAddToCart, title, copy }) {
  return (
    <div className="stack-lg">
      <SectionTitle eyebrow="Catalog" title={title} copy={copy} />
      <SearchFilters filters={filters} onChange={onFilterChange} />
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
      {!products.length ? (
        <div className="empty-state">
          No products match your filters yet.
        </div>
      ) : null}
    </div>
  );
}
