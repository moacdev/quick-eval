// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {prisma} from '../../prisma/prisma_global.ts'

export default async function handler(req, res) {
  const {jury} = req.body
  let evalData = await prisma.eval.findMany({
  })
  return res.status(200).json( evalData.map( ev =>  {ev.evals = JSON.parse(ev.evals); return ev} ) )
  
}
