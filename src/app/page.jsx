import { getSession } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client';

export default async function Page() {
  const prisma = new PrismaClient();

  const session = await getSession();
  const user = session?.user || null;

  async function checkIfEmailExists(email) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return existingUser !== null;
  }

  if (user && !(await checkIfEmailExists(user.email))) {
    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    });
    console.log(newUser);
  }

  return (
    <>
    <h1>this is the home page</h1>
    <a className="fakeButton" href="/trivia">Play Now!</a>
    </>
  );
}
