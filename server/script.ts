import { prisma } from "./lib/prisma";

async function main() {

  await prisma.user.deleteMany();
  
  await prisma.user.create({
    data: {
      name: "Arnav",
      email: "arnav@test.com",
      posts: {
        create: [
          { title: "Arnav Post 1", content: "Hello world", published: true },
          { title: "Arnav Post 2", content: "Another post", published: false },
        ],
      },
    },
  });

  await prisma.user.create({
    data: {
      name: "Rahul",
      email: "rahul@test.com",
      posts: {
        create: [
          { title: "Rahul Post 1", content: "First", published: true },
          { title: "Rahul Post 2", content: "Second", published: true },
          { title: "Rahul Post 3", content: "Third", published: false },
        ],
      },
    },
  });

  await prisma.user.create({
    data: {
      name: "Priya",
      email: "priya@test.com",
      posts: {
        create: [
          { title: "Priya Post 1", content: "Hey", published: true },
          { title: "Priya Post 2", content: "Yo", published: false },
        ],
      },
    },
  });

  const result = await prisma.user.findMany({
    include: { posts: true },
  });

  console.log(JSON.stringify(result, null, 2));
}

main()  
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });