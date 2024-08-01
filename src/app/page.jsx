import { getSession } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client';
import './page.css'

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

  async function getNextUsername(baseName) {
    const count = await prisma.user.count({
      where: {
        username: {
          startsWith: baseName,
        },
      },
    });
    const nextNumber = count + 1;
    const paddedNumber = String(nextNumber).padStart(4, '0');
    return `${baseName}#${paddedNumber}`;
  }

  if (user && !(await checkIfEmailExists(user.email))) {
    const baseUsername = user.nickname || user.name || 'user';
    const username = await getNextUsername(baseUsername);

    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        picture: user.picture,
        username: username,
      },
    });
    console.log(newUser);
  }

  return (
    <div>
    <h1>Infinite Trivia</h1>
    <div className="info-section">
      <h2>About the Game</h2>
      <p>
        Welcome to the Infinite Trivia Game! Test your knowledge by swiping through various trivia questions.
        Answer correctly to score points and see how long you can keep going!
      </p>
    </div>
    <div className="info-section">
      <h2>How to Play</h2>
      <p>
        The game is simple and fun: 
        <ul>
          <li>Swipe left, right, up, or down to choose your answer.</li>
          <li>Correct answers will add time to your game, while incorrect answers will deduct time.</li>
        </ul>
        Try to answer as many questions as possible before the time runs out!
      </p>
    </div>
    <a className="fakeButton" href="/trivia">Play Now!</a>
  </div>
  );
}
