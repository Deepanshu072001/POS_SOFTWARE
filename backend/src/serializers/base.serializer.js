export const serializeBase = (doc) => ({
    id: doc._id,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
});