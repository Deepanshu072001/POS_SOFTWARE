import AppError from "../utils/AppError.js";

const validateReference = async (
  repository,
  id,
  name
) => {
  if (!id) return null;

  const document =
    await repository.findActiveById(id);

  if (!document) {
    throw new AppError(`${name} not found.`, 404);
  }

  return document;
};

export default validateReference;