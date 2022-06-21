// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { serialize } from 'cookie';

export default function handler(req, res) {
  const {jury} = req.body
  res.setHeader('Set-Cookie', serialize('jury', jury, { path: '/',}));
  res.status(200).end()
}
