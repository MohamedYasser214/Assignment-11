import { Router } from "express";
import * as US from "./user.service.js"
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorizations.js";
import { RoleEnum } from "../../common/enum/user.enum.js";
const router= Router()


router.post("/signup" , US.signup)
router.post("/signup/gmail" , US.signupWithGmail)
router.post("/login" , US.login)
router.get("/profile", authentication,US.getProfile)







export default router