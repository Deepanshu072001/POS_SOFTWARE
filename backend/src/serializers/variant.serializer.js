const serializeVariant = (variant) => {
  if (!variant) return null;

  const sellingPrice = Number(variant.sellingPrice || 0);
  const costPrice = Number(variant.costPrice || 0);

  return {
    id: variant._id,
    variantId: variant.variantId,

    product: variant.product
      ? {
          id: variant.product._id,
          productId: variant.product.productId,
          name: variant.product.name,
          code: variant.product.code,
        }
      : null,

    productName: variant.product?.name || null,

    name: variant.name,
    code: variant.code,

    sku: variant.sku,
    barcode: variant.barcode,

    sellingPrice,
    costPrice,

    profit: sellingPrice - costPrice,

    profitPercentage:
        costPrice > 0
        ? Number(
        (
          ((sellingPrice - costPrice) /
            costPrice) *
          100
        ).toFixed(2)
      )
    : 0,

    displayOrder: variant.displayOrder,

    isDefault: variant.isDefault,

    status: variant.status,

    createdBy: variant.createdBy
      ? {
          id: variant.createdBy._id,
          userId: variant.createdBy.userId,
          name: `${variant.createdBy.firstName} ${variant.createdBy.lastName}`,
        }
      : null,

    updatedBy: variant.updatedBy
      ? {
          id: variant.updatedBy._id,
          userId: variant.updatedBy.userId,
          name: `${variant.updatedBy.firstName} ${variant.updatedBy.lastName}`,
        }
      : null,

    createdAt: variant.createdAt,
    updatedAt: variant.updatedAt,
  };
};

export default serializeVariant;