export const notFound = (res, entity = "Resource") =>
  res.status(404).json({ message: `${entity} not found.` });

