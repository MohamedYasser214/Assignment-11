import { model } from "mongoose";
import { ProviderEnum } from "../../common/enum/user.enum.js";
import { sucessResponse } from "../../common/utils/response.success.js";
import {
  decrypt,
  encrypt,
} from "../../common/utils/security/encrypt.security.js";
import { Compare, Hash } from "../../common/utils/security/hash.security.js";
import { GenerateToken, verfyToken } from "../../common/utils/token.service.js";
import * as db_service from "../../DB/db.service.js";
import userModel from "./../../DB/models/user.model.js";
import { OAuth2Client } from "google-auth-library" ;

export const signup = async (req, res, next) => {
  try {
    const { userName, age, email, password, gender, phone } = req.body;

    const emailExist = await db_service.findOne({
      model: userModel,
      filter: { email },
    });
    if (emailExist) {
      throw new Error("email already Exist");
    }

    const user = await db_service.create({
      model: userModel,
      data: {
        userName,
        age,
        email,
        password: Hash({ plainText: password , salt_rounds:+process.env.SALT_ROUNDS }),
        gender,
        phone: encrypt(phone),
      },
    });

    sucessResponse({ res, status: 201, data: user });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "error", error: error.message, stack: error.stack });
  }
};

export const signupWithGmail = async (req, res, next) => {
  const { idToken } = req.body;

  console.log(idToken);
  const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken ,
      audience: "155651637875-ei4nthqejguf7se9gu8hcv8gtnqhm877.apps.googleusercontent.com", 
    });
    const payload = ticket.getPayload();
    const {email , email_verified , name ,picture} = payload

    let user = await db_service.findOne({model:userModel , filter:{email}})
    if(!user){
      user = await  db_service.create({
        model:userModel,
        data:{
          email,
          confirmed:email_verified,
          userName:name,
          profilePicture:picture,
          provider:ProviderEnum.google
        }
      })
    }

    if(user.provider == ProviderEnum.system){
      throw new Error("Please Login on system only" , {cause:400});
      
    }
        const access_token = GenerateToken({
      payload: { id: user._id, email: user.email },
      secret_key: process.env.SECRET_KEY,
      options: {
        expiresIn: "1day"
      },
    });
    sucessResponse({res , message:"Success Login" , data:{access_token}})
  
  }

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await db_service.findOne({
      model: userModel,
      filter: {
        email,
        provider: ProviderEnum.system,
      },
    });
    if (!user) {
      throw new Error("user Not Exist");
    }

    const match = Compare({ plainText: password, cipherText: user.password });

    if (!match) {
      throw new Error("Invalid Password", { cause: 400 });
    }

    const access_token = GenerateToken({
      payload: { id: user._id, email: user.email },
      secret_key: "ahmed",
      options: {
        expiresIn: "1day",
        // noTimestamp: true
        // issuer: "http://localhost:3000",
        // audience: "http://localhost:4000",
        // notBefore: 60,
        // jwtid: uuidv4()
      },
    });
    sucessResponse({ res, data: { access_token } });
  } catch (error) {
    return res.status(404).json({ message: "error", error: error.message });
  }
};

export const getProfile = async (req, res, next) => {
  console.log(req.user);
  sucessResponse({ res, message: "Success Login", data: req.user });
};
