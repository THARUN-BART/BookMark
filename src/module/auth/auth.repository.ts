import { prisma } from "../../config/db";

class AuthRepository {
    async findByEmail(email:string){
        return prisma.user.findUnique({
            where:{
                email
            }
        });
    }

    async createUser(data: {
        name: string;
        email: string;
        password: string;
        age:number;
        verified: boolean;
    }) {
        return prisma.user.create({
            data
        });
    }
    async verifyUser(email: string) {
        return prisma.user.update({
            where: {
                email
            },
            data: {
                verified: true
            }
        });
    }
    async updatePassword(email: string, passwordHash: string) {
      return prisma.user.update({
        where: { email },
        data: { password: passwordHash },
      });
    }
}

export const authrepo=new AuthRepository();