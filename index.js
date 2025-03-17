import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()


// async function main() {
//   // ... you will write your Prisma Client queries here
// }

const main = async () => {

    // 1> to create a single user

    // const user = await prisma.user.create({
    //  data:{
    //      name :"Zobia Khan",
    //      email : "zobia@gmail.com",
    //      password :"000"
    //  },
    // });
    // console.log(user);


    // 2> to create many users

    // const newUsers = await prisma.user.createMany({
    //     data:[
    //         {
    //             name :"John Doe",
    //             email : "doejohn@gmail.com",
    //             password :"000"
    //         },
    //         {
    //             name :"Priya Singh",
    //             email : "priya@gmail.com",
    //             password :"111"
    //         },
    //         {
    //             name :"Zobia Sheikh",
    //             email : "sheikhzobia@gmail.com",
    //             password :"123"
    //         },
    //     ],
    // });
    // console.log(newUsers);


    // 3> to fetch single user data (first user's data)

    // const getUser = await prisma.user.findFirst();
    // console.log(getUser);


    // 4> to fetch multiple users data

    // const getUsers = await prisma.user.findMany();
    // console.log(getUsers);


    //  5> to read user's data through its id (only id & email are unique)

    // const user = await prisma.user.findUnique({
    //     where: {id: 8},
    // })
    // console.log(user);

    
    //  6> to read user's data through its other credentials

    // const user = await prisma.user.findMany({
    //     where: {name: "Zobia Sheikh"},
    // })
    // console.log(user);

    // 7> to update the user's data
    
    // const updateUser = await prisma.user.updateMany({
    //     where: {name: "Prince"},
    //     data: {name: "Prince Rathore", email: "rathoreprince@gmail.com"},
    // })
    // console.log(updateUser);

    // 8> to delete a single user

    // const deleteUser = await prisma.user.delete({
    //     where: {id: 8},
    // })
    // console.log(deleteUser);

    
    // 9> to delete a multi users

    const deleteUsers = await prisma.user.deleteMany({
        where: {
            id: { in: [3, 2]}, 
          },    })
    console.log(deleteUsers);

};

main()
    // .catch((e) => console.error(e))
    // .finally(async ()=> {
    //     await prisma.$disconnect();
    // })
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

   