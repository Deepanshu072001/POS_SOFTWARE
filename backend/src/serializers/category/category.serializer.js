const serializeCategory = (category) => {
  if (!category) return null;

  return {
    id: category._id,
    categoryId: category.categoryId,

    name: category.name,
    code: category.code,

    description: category.description,
    image: category.image,

    displayOrder: category.displayOrder,

    status: category.status,

    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
};

export default serializeCategory;