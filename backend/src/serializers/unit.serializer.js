const serializeUnit = (unit) => {
  if (!unit) return null;

  return {
    id: unit._id,
    unitId: unit.unitId,

    name: unit.name,
    code: unit.code,
    symbol: unit.symbol,

    description: unit.description,

    status: unit.status,

    createdAt: unit.createdAt,
    updatedAt: unit.updatedAt,
  };
};

export default serializeUnit;