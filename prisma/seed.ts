import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const noop = () => {};

async function seed() {
  // cleanup the existing database
  await prisma.user?.deleteMany({}).catch(noop);
  await prisma.post?.deleteMany({}).catch(noop);

  const hashedPassword = await bcrypt.hash("pinggg", 10);

  await Promise.all(
    [
      {
        name: "John Doe",
        email: "john.doe@remix.run",
        hashedPassword,
        posts: [
          {
            title: "Why you should use Remix",
            body: "Because Theo said so",
          },
          {
            title: "Why you should use Remix, part 2",
            body: "Let the record show, Theo definitely endorsed this. I swear it under penalty of the law.",
          },
        ],
      },
      {
        name: "Jane Doe",
        email: "jane.doe@remix.run",
        hashedPassword,
        posts: [
          {
            title: "Hi my name is Jane",
            body: "Welcome to my blog, thank you for stopping by",
          },
          {
            title: "Why I love the Olive Garden",
            body: "Because when you're there, you're family",
          },
          {
            title: "I wonder if Theo will date me",
            body: "I just love that big swoopy hair 😍",
          },
        ],
      },
      {
        name: "Chance the Dev",
        email: "hi@chance.dev",
        hashedPassword,
        posts: [
          {
            title: "Why am I even here?",
            body: "Oh yeah, we're talking about Remix. That shit's rad.",
          },
        ],
      },
    ].map(({ posts, hashedPassword, ...data }) =>
      prisma.user.create({
        data: {
          ...data,
          password: {
            create: {
              hash: hashedPassword,
            },
          },
          posts: {
            create: posts,
          },
        },
      })
    )
  );
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Seeding complete!");
    await prisma.$disconnect();
  });
