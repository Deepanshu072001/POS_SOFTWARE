const serializeBranch = (branch) => {
  if (!branch) return null;

  return {
    id: branch._id,
    branchId: branch.branchId,

    name: branch.name,
    code: branch.code,

    email: branch.email,
    phone: branch.phone,
    gstNumber: branch.gstNumber,

    address: branch.address,

    location: branch.location,

    openingTime: branch.openingTime,
    closingTime: branch.closingTime,

    timezone: branch.timezone,
    currency: branch.currency,

    logo: branch.logo,

    status: branch.status,

    fullAddress: branch.fullAddress,

    createdAt: branch.createdAt,
    updatedAt: branch.updatedAt,
  };
};

export default serializeBranch;