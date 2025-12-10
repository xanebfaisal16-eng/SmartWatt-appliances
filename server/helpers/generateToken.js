import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../config/config.js"
const generateToken = (req, res, user) => {
        const token = jwt.sign= ({id: user._id}, JWT_SECRET,{expiresin :"id"})  // expires after 1 day due to this token in other words temporary “yes, you are logged in now.”
        const refreshToken = jwt.sign = ({id: user.id}, JWT_SECRET,{expiresin :"id"}) // Refresh Token → secret helper that keeps you logged in longer 
        user.password = undefined
        user.resetPasswordKey = undefined
                res.json({
                ok: true, 
                token, 
                refreshToken, 
                user  
       })
}
export default generateToken