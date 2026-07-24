const serializePurchaseItem = (item) => ({
  id: item._id,

  purchaseItemId: item.purchaseItemId,

  variant: item.variant
    ? {
        id: item.variant._id,
        variantId: item.variant.variantId,
        name: item.variant.name,
        sku: item.variant.sku,
        product: item.variant.product
          ? {
              id: item.variant.product._id,
              productId: item.variant.product.productId,
              name: item.variant.product.name,
            }
          : null,
      }
    : null,

  quantity: item.quantity,

  freeQuantity: item.freeQuantity,

  receivedQuantity: item.receivedQuantity,

  unitCost: item.unitCost,

  discountPercentage:
    item.discountPercentage,

  discountAmount:
    item.discountAmount,

  taxPercentage:
    item.taxPercentage,

  taxAmount:
    item.taxAmount,

  lineTotal:
    item.lineTotal,

  batchNumber:
    item.batchNumber,

  manufacturingDate:
    item.manufacturingDate,

  expiryDate:
    item.expiryDate,

  remarks:
    item.remarks,
});

const serializePurchase = (data) => {
  if (!data) return null;

  const purchase = data.purchase ?? data;
  const items = data.items ?? [];

  return {
    id: purchase._id,

    purchaseId:
      purchase.purchaseId,

    purchaseNumber:
      purchase.purchaseNumber,

    supplier: purchase.supplier
      ? {
          id: purchase.supplier._id,
          supplierId:
            purchase.supplier.supplierId,
          code:
            purchase.supplier.code,
          name:
            purchase.supplier.name,
        }
      : null,

    branch: purchase.branch
      ? {
          id: purchase.branch._id,
          branchId:
            purchase.branch.branchId,
          code:
            purchase.branch.code,
          name:
            purchase.branch.name,
        }
      : null,

    invoiceNumber:
      purchase.invoiceNumber,

    invoiceDate:
      purchase.invoiceDate,

    purchaseDate:
      purchase.purchaseDate,

    purchaseType:
      purchase.purchaseType,

    paymentStatus:
      purchase.paymentStatus,

    purchaseStatus:
      purchase.purchaseStatus,

    subtotal:
      purchase.subtotal,

    discountAmount:
      purchase.discountAmount,

    taxAmount:
      purchase.taxAmount,

    shippingCharge:
      purchase.shippingCharge,

    roundOff:
      purchase.roundOff,

    grandTotal:
      purchase.grandTotal,

    paidAmount:
      purchase.paidAmount,

    dueAmount:
      purchase.dueAmount,

    notes:
      purchase.notes,

    approvedBy:
      purchase.approvedBy,

    approvedAt:
      purchase.approvedAt,

    createdAt:
      purchase.createdAt,

    updatedAt:
      purchase.updatedAt,

    items:
      items.map(serializePurchaseItem),
  };
};

export default serializePurchase;