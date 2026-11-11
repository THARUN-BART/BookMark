import bcrypt from "bcryptjs";

export const hashPassword =
 async (password:string) => {
   return bcrypt.hash(
      password,
      10
   );
 };

export const comparePassword = async (
   plain:string,
   hashed:string
 ) => {
    return bcrypt.compare(
      plain,
      hashed
    );
 };