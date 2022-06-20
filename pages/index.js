import Head from 'next/head'
import Image from 'next/image'
import { Input, Select, Option, Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";
import { useState } from 'react';


export default function Home() {
  
  const [activeEval, setActiveEval] = useState(-1)
  const [data, setData] = useState([
      {
        type: 'ethnie',
        name: 'Bambara',
        evals: {
          presentation_service: '',
          presentation_plat: '',
          gout: '',
        },
      },
      {
        type: 'ethnie',
        name: 'Soninké',
        evals: {
          presentation_service: '',
          presentation_plat: '',
          gout: '',
        },
      },
      {
        type: 'country',
        name: 'Congo',
        evals: {
          presentation_service: '',
          presentation_plat: '',
          gout: '',
        },
      },
      {
        type: 'country',
        name: 'Algerie',
        evals: {
          presentation_service: '',
          presentation_plat: '',
          gout: '',
        },
      },
    ]);
 
  return (
    <div className='flex flex-col max-w-2xl w-full mx-auto min-h-screen items-center justify-center'>
      <h1>Notation communautaire</h1>
      {activeEval == -1 && (<div className='flex flex-col max-w-2xl w-full mx-auto min-h-screen items-center justify-center'>
        <h2>Ethnies</h2>
        <div className='flex flex-wrap'>
          {data.map( (e,i) => e.type == 'ethnie' ? <button key={i} onClick={() => setActiveEval(i)} type="button" className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">{e.name}</button> : '' )}
        </div>
        <h2>Pays</h2>
        <div className='flex flex-wrap'>
        {data.map( (e,i) => e.type == 'country' ? <button key={i} onClick={() => setActiveEval(i)} type="button" className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">{e.name}</button> : '' )}
        </div>
      </div>)}
      {activeEval != -1 &&(<EvalScreen data={data} setActiveEval={ _ => setActiveEval(_)} index={activeEval} handleChanges={ (_, __) => {let ___ = data; ___[__] = _; setData(___) } } />)}
    </div>
  )
}

function EvalScreen({data,index, handleChanges, setActiveEval}) {
  const [open, setOpen] = useState(0);
  return <div className='flex flex-col items-end gap-4 w-full relative'>
    <button onClick={ () => setActiveEval(-1)}>Retour</button>
    <h2></h2>
      <Accordion open={open === 1} onClick={() => setOpen(1)}>
        <AccordionHeader>PRESENTATION CUISINE</AccordionHeader>
        <AccordionBody className='w-full max-w-xs mx-auto flex flex-col gap-2'>
          <Input label="Présentation du service" type="number" value={data[index].evals.presentation_service} onChange={ _ => handleChanges(_.currentTarget.value, index) } />
          <Input label="Présentation du plat" type="number" value={data[index].evals.presentation_plat} onChange={ _ => handleChanges(_.currentTarget.value, index) }  />
          <Input label="Le Goût" type="number" value={data[index].evals.gout} onChange={ (_) => { handleChanges(_.currentTarget.value, index)} }  />
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 2} onClick={() => setOpen(2)}>
        <AccordionHeader>DANSE TRADITIONNELLE</AccordionHeader>
        <AccordionBody className='w-full max-w-xs mx-auto flex flex-col gap-2'>
          <Input label="Présentation du service" type="number" />
          <Input label="Présentation du plat" type="number" />
          <Input label="Le Goût" type="number" />
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 3} onClick={() => setOpen(3)}>
        <AccordionHeader>ORGANISATION DU GROUPE</AccordionHeader>
        <AccordionBody className='w-full max-w-xs mx-auto flex flex-col gap-2'>
          <Input label="Présentation du service" type="number" />
          <Input label="Présentation du plat" type="number" />
          <Input label="Le Goût" type="number" />
        </AccordionBody>
      </Accordion>
  </div>
}
