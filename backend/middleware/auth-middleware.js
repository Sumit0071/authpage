import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

var checkUserAuth = async ( req, res, next ) => {
    let token
    const { authorization } = req.headers;
    if ( authorization && authorization.startsWith( 'Bearer' ) ) {
        try {
            //Get token from header
            token = authorization.split( ' ' )[1];
            //verify the token
            const { userID } = jwt.verify( token, process.env.JWT_SECRET_KEY );

            //get User from token
            req.User = await UserModel.findById( userID ).select( '-password' );
            next();
        }
        catch ( err ) {
            console.log( err );
            res.status( 401 ).send( { "status": "failed", "message": "Unauthorized user" } );
        }
    }
    if ( !token ) {
        res.status( 401 ).send( { "status": "failed", "message": "Unauthorized User,No token" } );
    }
}

export default checkUserAuth;