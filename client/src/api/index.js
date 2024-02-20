import axios from 'axios';
import jwt_decode from 'jwt-decode';
const API = axios.create({baseURL:'https://hiddenbrain.com/api'});
//auth

export const signIn = async({email,password})=>{
  await API.post('/auth/signin', {email, password});
}
export const signUp = async({name , email, password})=>{
  await API.post('auth/signup',{name, email, password});
}
export const googleSingIn = async({name, email, img})=>{
  
}