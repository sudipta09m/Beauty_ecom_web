const read = (key, fallback) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : fallback;
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const storage = { read, write };

