const serializeTax = (tax) => {
  if (!tax) return null;

  return {
    id: tax._id,
    taxId: tax.taxId,

    name: tax.name,
    code: tax.code,

    type: tax.type,
    rate: tax.rate,

    description: tax.description,

    isDefault: tax.isDefault,

    status: tax.status,

    createdAt: tax.createdAt,
    updatedAt: tax.updatedAt,
  };
};

export default serializeTax;