/*import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure Prisma is correctly set up
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google"


  Handle POST request for user sign-in
  
 export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Missing email or password" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful", user }, { status: 200 });
  } catch (error) {
    console.error("Sign-in error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}*/

/*import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/api/auth/signin', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ message: data.message });
        }

        res.setHeader('Set-Cookie', `token=${data.token}; Path=/; HttpOnly`);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
}*/
