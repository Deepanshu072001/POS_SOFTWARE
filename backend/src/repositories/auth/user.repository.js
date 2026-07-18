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
        select: "name description permissions",
        populate: {
          path: "permissions",
          select: "name module action",
        },
      });
  }

  async findById(id) {
    return User.findOne({
      _id: id,
      isDeleted: false,
    }).populate({
      path: "role",
      select: "name description permissions",
      populate: {
        path: "permissions",
        select: "name module action",
      },
    });
  }

  async findByUserId(userId) {
    return User.findOne({
      userId,
      isDeleted: false,
    }).populate({
      path: "role",
      select: "name description permissions",
      populate: {
        path: "permissions",
        select: "name module action",
      },
    });
  }

  async update(id, data) {
    return User.findByIdAndUpdate(id, data, {
      returnDocument: "after",
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
        returnDocument: "after",
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