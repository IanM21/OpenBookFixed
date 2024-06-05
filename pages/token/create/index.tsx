/* eslint-disable @typescript-eslint/no-non-null-assertion */

"use client";
// import { Metadata } from "next";
import DefaultLayout from '../../../components/layouts/DefaultLayout';
import { CreateToken } from '../../../components/token/CreateToken';

// import { CreateToken2 } from '../../components/token/CreateToken2';


// export const metadata: Metadata = {
//   title:
//     "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
//   description: "This is Next.js Home for TailAdmin Dashboard Template",
// };

const Token = () => {
  return (
    <>
      <DefaultLayout>
        <CreateToken />
        {/* <CreateToken2 /> */}
      </DefaultLayout>
    </>
  );
}

export default Token;
