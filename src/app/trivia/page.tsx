'use client';
import withAuth from "../components/withAuth";
import { PrismaClient } from '@prisma/client'
import { getSession } from '@auth0/nextjs-auth0';
import getData from "../components/getData";
import Advanced from "../components/cards";
import './page.css'



 function Page() {
    return (
      <div className='app'>
        <Advanced userId={undefined} />
      </div>
    
  )
 }   


export default withAuth (Page);
