// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {prisma} from '../../prisma/prisma_global.ts'

export default async function handler(req, res) {
  const {data, jury} = req.body
  if (jury == '' || jury == null ||jury == 'null' || jury == "Admin") return res.status(400).end()
    await prisma.eval.upsert({
      where: {
        jury,
      },
      create:{
        evals: JSON.stringify(data),
        jury
    },
    update:
    {
      evals: JSON.stringify(data)
    }
  })
  res.status(200).end()
}
