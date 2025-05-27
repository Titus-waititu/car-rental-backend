import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
    const admin1 = await prisma.admins.upsert({
        where: {username:"Titus"},
        update:{},
        create:{
            username:"Titus",
            password:"1234",
            email:"titus@gmail.com",
            
        }
    })
    const admin2 = await prisma.admins.upsert({
        where: {username:"Jeremy"},
        update:{},
        create:{
            username:"Jeremy",
            password:"1234",
            email:"jerry@gmail.com",
            
        }
    })
    console.log({admin1,admin2})
}

main()
.catch((err) => {
       console.error(err)
       process.exit(1)           
})
.finally(async () => {
    await prisma.$disconnect();
})