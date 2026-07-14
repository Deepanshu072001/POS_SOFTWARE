import { User } from "../../models/index.js";

class UserRepository {
  async create(userData) {
    return User.create(userData);
  }

  async findByEmail(email) {
    return User.findOne({
      email,
      isDeleted: false,
    })
      .select("+password")
      .populate({
        path: "role",
        select: "name permissions",
      });
  }

  async findById(id) {
    return User.findOne({
      _id: id,
      isDeleted: false,
    }).populate({
      path: "role",
      select: "name permissions",
    });
  }

  async findByUserId(userId) {
    return User.findOne({
      userId,
      isDeleted: false,
    }).populate({
      path: "role",
      select: "name permissions",
    });
  }

  async update(id, data) {
    return User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async softDelete(id) {
    return User.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
      },
      {
        new: true,
      }
    );
  }

  async exists(email) {
    return User.exists({
      email,
      isDeleted: false,
    });
  }
}

export default new UserRepository();