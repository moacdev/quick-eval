import Head from 'next/head'
import Image from 'next/image'
import { Input, Select, Option, Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";
import { useState } from 'react';

class Eval {
  constructor(type, name){
    this.type = type,
    this.name = name,
    this.cuisine = {
      presentation_service : 0,
      presentation_plat : 0,
      gout : 0
    }
    this.danse = {
      originalite : 0,
      occupation_scenique : 0,
      expression_du_corps : 0
    }
    this.organisation_group = {
      presentation_du_stand : 0,
      orginalite_de_la_decoration : 0,
      coordination_des_activites : 0
    }
  }
}

export default function Home() {
  
  const [activeEval, setActiveEval] = useState(-1)
  const [data, setData] = useState([
    new Eval('ethnie', 'Bambara'),
    new Eval('ethnie', 'FORGERON'),
    new Eval('ethnie', 'Les FILS DU DESERT'),
    new Eval('ethnie', 'MALINKE/KASSONKE'),
    new Eval('ethnie', 'MIANKA'),
    new Eval('ethnie', 'BOZO'),
    new Eval('ethnie', 'DOGON'),
    new Eval('pays', 'CONGO'),
    new Eval('pays', 'GABON'),
    new Eval('pays', 'COTE D\'IVOIRE'),
    new Eval('pays', 'BURKINA FASSO'),
    new Eval('pays', 'AFRIQUE DU SUD'),
    new Eval('pays', 'CAMEROUN'),
  ]);

  const [selectedEval, setSelectedEval] = useState(-1)
  const [selectedActivity, setSelectedActivity] = useState(-1)
  const [selectedCritere, setSelectedCritere] = useState(-1)

  const activites = [
    {
      name: 'cuisine',
      label: 'PRESENTATION CUISINE',
      criteres: [
        {
          name: "presentation_service",
          label: "Présentation du service",
        },
        {
          name: "presentation_plat",
          label: "Présentation du plat",
        },
        {
          name: "gout",
          label: "Le Goût",
        },
      ]
    },
    {
      name: 'danse',
      label: 'DANSE TRADITIONNELLE',
      criteres: [
        {
          name: "originalite",
          label: "Originalité",
        },
        {
          name: "occupation_scenique",
          label: "Occupation scénique",
        },
        {
          name: "expression_du_corps",
          label: "Expression du corps",
        },
      ]
    },
    {
      name: 'organisation_group',
      label: 'ORGANISATION DU GROUPE',
      criteres: [
        {
          name: "presentation_du_stand",
          label: "Présentation du stand",
        },
        {
          name: "orginalite_de_la_decoration",
          label: "Orginalité de la décoration",
        },
        {
          name: "coordination_des_activites",
          label: "Coordination des activités",
        },
      ]
    },
    
    
  ]

  const getTotal = (_criteres) => {
    let sum = 0.0;
    for (const _ in _criteres) sum += _criteres[_] == '' ? 0 : parseInt(_criteres[_])
    return parseFloat(sum / Object.keys(_criteres).length).toFixed(2) ;
  } 

  const getTotalPts = (..._criteres) => {
    let superTotal = 0.0;
    for (let i = 0; i < _criteres.length; i++) {
      superTotal = parseFloat(superTotal + parseFloat(getTotal(_criteres[i])))
      console.log(_criteres[i]);
      
    }
    
    return superTotal;
  }

  return (
    <div className='flex flex-col gap-4 max-w-2xl w-full mx-auto min-h-screen items-center justify-center'>
      <h1>Notation communautaire</h1>
      <div className="flex items-end gap-4 w-full">
        <Select variant="outlined" label="Ethnies/Pays" >
          {data.map( (e, i) => (<Option key={i} onClick={ ()=> setSelectedEval(i) }>{e.name}</Option>) )}
        </Select>
        <Select variant="standard" label="Activité">
          {activites.map( (a, i) => <Option key={i} onClick={ ()=> setSelectedActivity(i) }>{a.label}</Option> )}
        </Select>
        {selectedActivity != -1 && (<Select variant="static" label="critère">
          {activites[selectedActivity].criteres.map( (c, i) => (<Option key={i} onClick={ ()=> setSelectedCritere(i)} >{c.label}</Option>) )}
        </Select>)}
      </div>
      { selectedEval != -1 && selectedActivity != -1 && selectedCritere != -1  &&(
      <div className='w-full'>
        <div className='h-16 w-16 mx-auto'>
        <Input label="Note" className='h-16' value={ data[selectedEval][activites[selectedActivity].name][activites[selectedActivity].criteres[selectedCritere].name]} onChange={ (_) => { setData( [...data].map( (e,i) => {
          if (i == selectedEval) {
            e[activites[selectedActivity].name][activites[selectedActivity].criteres[selectedCritere].name] = _.currentTarget.value
            return e;
          }
          else return e;
          } ) ); console.log(data);  } } /></div>
          <div className='flex flex-col gap-2 w-full max-w-sm mt-6 mx-auto rounded p-4'>
            <h1 className='text-grey-900'>Récapitilatif</h1>
            <p className='text-grey-900'>Ethnie/pays: <span className='bg-grey-900 text-white rounded p-2'>{data[selectedEval].name}</span></p>
            {activites.map( (a, i) => 
            <>
              <p className='text-grey-900'>
                {a.label} :
              </p>
              <div className='bg-grey-900 ml-6 p-2'>
                {activites[selectedActivity].criteres.map( (c, _i) => 
                <p className='text-white'>
                  {c.label} : {data[selectedEval][activites[i].name][activites[i].criteres[_i].name]}
                </p>
                )}
                <span className='text-blue-600'>Total: { getTotal(data[selectedEval][activites[i].name]) } </span>
              </div>
            </>
            )}
            <p>
            Total de point : <span className='bg-grey-900 text-white rounded p-2'>
              {getTotalPts(data[selectedEval][activites[0].name], data[selectedEval][activites[1].name], data[selectedEval][activites[2].name])}
              </span>
            </p>
          </div>
      </div>)}
      
    </div>
  )
}
