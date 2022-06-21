// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {prisma} from '../../prisma/prisma_global.ts'

export default async function handler(req, res) {
  const {data, jury} = req.body
  if (jury == '') return res.status(400).end()
  let evalData = await prisma.eval.findFirst({
    where: {
      jury: jury,
    }
  })
  if (evalData) {
    evalData = await prisma.eval.update({
      where: {
        jury: jury,
      },
      data:{
        evals: JSON.stringify(data)
    }})
  }else evalData = await prisma.eval.create({data:{
    evals: JSON.stringify(data),
    jury: jury
  }})
  res.status(200).end()
}
