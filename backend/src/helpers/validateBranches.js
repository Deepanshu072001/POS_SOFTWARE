import branchRepository from "../repositories/branch/branch.repository.js";

import AppError from "../utils/AppError.js";

const validateBranches = async (
  branchIds = []
) => {
  for (const id of branchIds) {
    const branch =
      await branchRepository.findActiveById(id);

    if (!branch) {
      throw new AppError(
        "One or more branches are invalid.",
        404
      );
    }
  }
};

export default validateBranches;