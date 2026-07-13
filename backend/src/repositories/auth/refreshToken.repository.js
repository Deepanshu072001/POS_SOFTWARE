import { RefreshToken } from "../../models/index.js";

class RefreshTokenRepository {

    async create(data) {

        return await RefreshToken.create(data);

    }

    async find(token) {

        return await RefreshToken.findOne({
            token,
            isRevoked:false
        });

    }

    async revoke(token){

        return await RefreshToken.findOneAndUpdate(
            {token},
            {isRevoked:true},
            {new:true}
        );

    }

}
export default new RefreshTokenRepository();