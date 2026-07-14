import { RefreshToken } from "../../models/index.js";

class RefreshTokenRepository {
  async create(data) {
    return RefreshToken.create(data);
  }

  async find(token) {
    return RefreshToken.findOne({
      token,
      isRevoked: false,
    }).populate("user");
  }

  async revoke(token) {
    return RefreshToken.findOneAndUpdate(
      { token },
      {
        isRevoked: true,
        revokedAt: new Date(),
      },
     {
        returnDocument: "after"
    }
    );
  }

  async revokeAll(userId) {
  return RefreshToken.updateMany(
    {
      user: userId,
      isRevoked: false,
    },
    {
      isRevoked: true,
      revokedAt: new Date(),
    }
  );
}

  async deleteExpired() {
    return RefreshToken.deleteMany({
      expiresAt: {
        $lt: new Date(),
      },
    });
  }
}

export default new RefreshTokenRepository();