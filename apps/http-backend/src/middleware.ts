import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken'
import { JWT_SECRET } from  "@repo/backend-common/config"

export function authMiddleware(req:Request,res:Response,next:NextFunction){
    try{
        const token=req.headers.authorization ?? "";
        const decoded=jwt.verify(token,JWT_SECRET);
        req.userId=(decoded as JwtPayload).id;
        next();
    }catch(err){
        console.log(err);
        res.status(403).json({
            message:"Invalid credentials"
        })
    }
}