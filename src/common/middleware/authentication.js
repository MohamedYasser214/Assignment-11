import { model } from "mongoose";
import { verfyToken } from "../utils/token.service.js";
import userModel from "../../DB/models/user.model.js";

export const authentication = async(req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new Error("Token  not exist");
  }

  const decoded = verfyToken({ token: authorization, secret_key: "ahmed" });

  if (!decoded || !decoded?.id) {
    throw new Error("invalid Token");
  }
    const user = await db_service.findById({
    model: userModel,
    id: decoded.id,
    select: "-password",
  });
  if (!user) {
    throw new Error("User NoT Exist", { cause: 400 });
  }

  const {prefix , token} = authorization.spllit(" ")
  if(prefix !== "bearer"){
    throw new Error(" Invalid Token Prefix");
    
  }
  req.user=user
  next()
  
};
