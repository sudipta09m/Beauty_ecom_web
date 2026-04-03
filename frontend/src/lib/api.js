const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const parseJson = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed." }));
    throw new Error(error.message || "Request failed.");
  }
  return response.json();
};

export const request = async (path, options = {}) => {
  try {
    const { headers, ...restOptions } = options;
    const response = await fetch(`${API_URL}${path}`, {
      ...restOptions,
      headers: {
        "Content-Type": "application/json",
        ...(headers || {})
      }
    });
    return await parseJson(response);
  } catch (error) {
    throw error;
  }
};

export const getProducts = async () => {
  try {
    return await request("/products");
  } catch (error) {
    return [];
  }
};

export const getTrending = async () => {
  try {
    return await request("/products/trending");
  } catch (error) {
    return [];
  }
};

export const getOffers = async () => {
  try {
    return await request("/products/offers");
  } catch (error) {
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    return await request(`/products/${id}`);
  } catch (error) {
    return null;
  }
};
