export const buildPaginationOptions = (query) => {
  const page = Math.max(
    parseInt(query.page || "1", 10),
    1
  );

  const limit = Math.min(
    Math.max(parseInt(query.limit || "10", 10), 1),
    100
  );

  const sortField = query.sort || "createdAt";

  const sortOrder =
    query.order === "asc" ? 1 : -1;

  return {
    page,
    limit,
    sort: {
      [sortField]: sortOrder,
    },
  };
};