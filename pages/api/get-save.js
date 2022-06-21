// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {prisma} from '../../prisma/prisma_global.ts'

export default async function handler(req, res) {
  const {jury} = req.body
  let evalData = null
  if (jury && jury != '') {
    evalData = await prisma.eval.findFirst({
      where: {
        jury: jury,
      }
    })
    if (evalData) {
      evalData = await prisma.eval.findFirst({
        where: {
          jury: jury,
        },})
        return res.status(200).json(JSON.parse(evalData.evals))

    }
  }
  evalData = await prisma.eval.findMany({
    where:{
      OR:[
        {
          jury: 'A'
        },
        {
          jury: 'B'
        },
      ]
    }
  })
  return res.status(200).json( evalData.map( ev =>  {ev.evals = JSON.parse(ev.evals); return ev} ) )
  
}
