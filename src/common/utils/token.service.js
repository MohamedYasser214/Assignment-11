import jwt from 'jsonwebtoken';
export const GenerateToken=({payload , secret_key , options = {}} = {})=>{
    return jwt.sign(payload , secret_key , options)
}

export const verfyToken=({token , secret_key , options = {}} = {})=>{
    return jwt.verify(token , secret_key , options)
}