import { categories } from "../data/products";

export default function SearchFilters({ filters, onChange }) {
  return (
    <section className="filter-panel">
      <div className="filter-panel__grid">
        <label className="form-field">
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

        <label className="form-field">
          <span>Price Range</span>
          <select
            value={filters.price}
            onChange={(event) => onChange("price", event.target.value)}
            className="form-control"
          >
            <option value="all">All</option>
            <option value="0-25">Under Rs. 25</option>
            <option value="25-40">Rs. 25 to Rs. 40</option>
            <option value="40-80">Rs. 40 to Rs. 80</option>
          </select>
        </label>

        <label className="form-field">
          <span>Ratings</span>
          <select
            value={filters.rating}
            onChange={(event) => onChange("rating", event.target.value)}
            className="form-control"
          >
            <option value="0">All Ratings</option>
            <option value="4">4+ stars</option>
            <option value="4.5">4.5+ stars</option>
          </select>
        </label>
      </div>
    </section>
  );
}
