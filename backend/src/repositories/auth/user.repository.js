import { User } from "../../models/index.js";

class UserRepository {

    async create(userData) {
        return await User.create(userData);
    }

    async findByEmail(email) {
        return await User.findOne({
            email
        }).select("+password").populate("role");
    }

    async findById(id) {
        return await User.findById(id)
            .populate("role");
    }

    async findByUserId(userId) {
        return await User.findOne({
            userId
        }).populate("role");
    }

    async update(id, data) {
        return await User.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true
            }
        );
    }

    async delete(id) {
        return await User.findByIdAndUpdate(
            id,
            {
                isDeleted: true
            },
            {
                new: true
            }
        );
    }

    async exists(email) {
        return await User.exists({
            email
        });
    }

}

export default new UserRepository();