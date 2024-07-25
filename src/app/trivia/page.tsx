'use client';
import withAuth from "../components/withAuth";
import { PrismaClient } from '@prisma/client'
import { getSession } from '@auth0/nextjs-auth0';


 function Home() {

    return (
      <h1>test</h1>
    )
 }   


export default (Home);
