// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {prisma} from '../../prisma/prisma_global.ts'

export default async function handler(req, res) {
  const {jury} = req.body
  if (jury == '') return res.status(400).end()
  let evalData = await prisma.eval.findFirst({
    where: {
      jury: jury,
    }
  })
  if (evalData) {
    evalData = await prisma.eval.findFirst({
      where: {
        jury: jury,
      }})
      res.status(200).json()
  }else res.status(200).end(null)
}
