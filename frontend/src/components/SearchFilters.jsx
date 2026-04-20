import { categories } from "../data/products";

export default function SearchFilters({ filters, onChange }) {
  return (
    <section className="filter-panel">
      <div className="filter-panel__grid">
        <label className="form-field form-field--search">
          <span>Search</span>
          <input
            value={filters.search}
            onChange={(event) => onChange("search", event.target.value)}
            placeholder="Search products"
            className="form-control"
          />
        </label>

        <label className="form-field">
          <span>Category</span>
          <select
            value={filters.category}
            onChange={(event) => onChange("category", event.target.value)}
            className="form-control"
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
