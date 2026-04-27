import ProductCard from "../components/ProductCard";
import SearchFilters from "../components/SearchFilters";
import SectionTitle from "../components/SectionTitle";

export default function ProductListingPage({
  products,
  filters,
  onFilterChange,
  onAddToCart,
  title,
  copy,
  showFilters = true,
  emptyMessage = "No products match your filters yet."
}) {
  return (
    <div className="stack-lg">
      <SectionTitle eyebrow="Catalog" title={title} copy={copy} />
      {showFilters ? <SearchFilters filters={filters} onChange={onFilterChange} /> : null}
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
      {!products.length ? (
        <div className="empty-state">
          {emptyMessage}
        </div>
      ) : null}
    </div>
  );
}
