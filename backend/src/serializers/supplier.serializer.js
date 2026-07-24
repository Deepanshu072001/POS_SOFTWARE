const serializeSupplier = (supplier) => {
  if (!supplier) return null;

  return {
    id: supplier._id,

    supplierId: supplier.supplierId,

    code: supplier.code,

    name: supplier.name,

    contactPerson: supplier.contactPerson,

    email: supplier.email,

    phone: supplier.phone,

    alternatePhone: supplier.alternatePhone,

    gstNumber: supplier.gstNumber,

    panNumber: supplier.panNumber,

    address: supplier.address,

    city: supplier.city,

    state: supplier.state,

    country: supplier.country,

    postalCode: supplier.postalCode,

    creditLimit: supplier.creditLimit,

    paymentTerms: supplier.paymentTerms,

    openingBalance: supplier.openingBalance,

    currentBalance: supplier.currentBalance,

    isPreferred: supplier.isPreferred,

    status: supplier.status,

    createdAt: supplier.createdAt,

    updatedAt: supplier.updatedAt,
  };
};

export default serializeSupplier;