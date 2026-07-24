const serializeProduct = (product) => {
  if (!product) return null;

  return {
    id: product._id,
    productId: product.productId,

    name: product.name,
    code: product.code,
    slug: product.slug,

    shortDescription: product.shortDescription,
    description: product.description,

    category: product.category
      ? {
          id: product.category._id,
          categoryId: product.category.categoryId,
          name: product.category.name,
          code: product.category.code,
        }
      : null,

    categoryName: product.category?.name || null,

    unit: product.unit
      ? {
          id: product.unit._id,
          unitId: product.unit.unitId,
          name: product.unit.name,
          code: product.unit.code,
          symbol: product.unit.symbol,
        }
      : null,

    unitName: product.unit?.name || null,

    tax: product.tax
      ? {
          id: product.tax._id,
          taxId: product.tax.taxId,
          name: product.tax.name,
          rate: product.tax.rate,
          type: product.tax.type,
        }
      : null,

    taxName: product.tax?.name || null,

    foodType: product.foodType,
    productType: product.productType,

    hasVariants: product.hasVariants,
    hasAddons: product.hasAddons,

    trackInventory: product.trackInventory,
    allowNegativeStock: product.allowNegativeStock,

    preparationTime: product.preparationTime,

    image: product.image,
    gallery: product.gallery || [],

    branches:
      product.branches?.map((branch) => ({
        id: branch._id,
        branchId: branch.branchId,
        name: branch.name,
        code: branch.code,
      })) || [],

    displayOrder: product.displayOrder,

    isAvailable: product.isAvailable,
    isFeatured: product.isFeatured,

    status: product.status,

    createdBy: product.createdBy
      ? {
          id: product.createdBy._id,
          userId: product.createdBy.userId,
          name: `${product.createdBy.firstName} ${product.createdBy.lastName}`,
        }
      : null,

    updatedBy: product.updatedBy
      ? {
          id: product.updatedBy._id,
          userId: product.updatedBy.userId,
          name: `${product.updatedBy.firstName} ${product.updatedBy.lastName}`,
        }
      : null,

    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

export default serializeProduct;