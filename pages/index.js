import Head from 'next/head'
import Image from 'next/image'
import { Input, Select, Option, Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";
import { useState, useEffect } from 'react';
import axios from 'axios'
import {prisma} from '../prisma/prisma_global.ts'

export async function getServerSideProps({req, res}) {
  let evals = null
  if (req.cookies?.jury) {
    let evalData = await prisma.eval.findFirst({
      where: {
        jury: req.cookies?.jury,
      }
    })
    if (evalData)
    evals = JSON.parse(evalData.evals)
    
  }
  return {
    props:{
      _jury: req.cookies?.jury || null,
      evals
    }
  }
}

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

export default function Home({_jury, evals}) {
  
  const [activeEval, setActiveEval] = useState(-1)
  const [data, setData] = useState(evals || [
    new Eval('ethnie', 'FORGERON'),
    new Eval('ethnie', 'Les FILS DU DESERT'),
    new Eval('ethnie', 'MALINKE/KASSONKE'),
    new Eval('ethnie', 'MIANKA'),
    new Eval('ethnie', 'BOZO'),
    new Eval('ethnie', 'DOGON'),
    new Eval('ethnie', 'SENOUFO'),
    new Eval('ethnie', 'PEULH'),
    new Eval('ethnie', 'SONINKE'),
    new Eval('ethnie', 'BAMBARA'),
    new Eval('pays', 'CONGO'),
    new Eval('pays', 'GABON'),
    new Eval('pays', 'COTE D\'IVOIRE'),
    new Eval('pays', 'BURKINA FASSO'),
    new Eval('pays', 'AFRIQUE DU SUD'),
    new Eval('pays', 'CAMEROUN'),
    new Eval('pays', 'GUINEE'),
    new Eval('pays', 'MADAGASCAR'),
    new Eval('pays', 'SENEGAL'),
  ]);
  const [classementData, setClassementData] = useState(data)

  const [juriesData, setJuriesData] = useState(null)

  useEffect(() => {
    axios.post("/api/get-save").then( ({data}) => {
      if (data) {
        setJuriesData(data)
      }
    } )
  
  }, [])
  

  const [selectedCom, setSelectedCom] = useState(-1)
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


  var tablesToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,'
    , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>'
    , templateend = '</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head>'
    , body = '<body>'
    , tablevar = '<table>{table'
    , tablevarend = '}</table>'
    , bodyend = '</body></html>'
    , worksheet = '<x:ExcelWorksheet><x:Name>'
    , worksheetend = '</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>'
    , worksheetvar = '{worksheet'
    , worksheetvarend = '}'
    , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
    , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
    , wstemplate = ''
    , tabletemplate = '';

    return function (table, name, filename) {
        var tables = table;

        for (var i = 0; i < tables.length; ++i) {
            wstemplate += worksheet + worksheetvar + i + worksheetvarend + worksheetend;
            tabletemplate += tablevar + i + tablevarend;
        }

        var allTemplate = template + wstemplate + templateend;
        var allWorksheet = body + tabletemplate + bodyend;
        var allOfIt = allTemplate + allWorksheet;

        var ctx = {};
        for (var j = 0; j < tables.length; ++j) {
            ctx['worksheet' + j] = name[j];
        }

        for (var k = 0; k < tables.length; ++k) {
            var exceltable;
            if (!tables[k].nodeType) exceltable = document.getElementById(tables[k]);
            ctx['table' + k] = exceltable.innerHTML;
        }

        //document.getElementById("dlink").href = uri + base64(format(template, ctx));
        //document.getElementById("dlink").download = filename;
        //document.getElementById("dlink").click();

        window.location.href = uri + base64(format(allOfIt, ctx));

    }
})();

const [jury, setJury] = useState(_jury)
const [screen, setScreen] = useState(jury == null || jury == 'null' ? 'sign' : 'eval')


useEffect(() => {
  axios.post('/api/save', {data, jury: jury})
}, [data])

useEffect(() => {
  axios.post('/api/save-jury-state', {jury: jury})
}, [jury])

  const handleSetData = (_) => {
    setData([...data].map((e, i) => {
      if (i == selectedEval) {
        e[activites[selectedActivity].name][activites[selectedActivity].criteres[selectedCritere].name] = _.currentTarget.value;
        return e;
      }
      else
        return e;
    }));
    setClassementData(data)
  }

  const getEvalsTotals = (juriesData) =>{
    let evals = []
    for (let i = 0; i < juriesData.length; i++) {

      for (let y = 0; y < juriesData[i].evals.length; y++) {
        if (i == 0) {
          evals.push({
            total: getTotalPts(juriesData[i].evals[y][activites[0].name],juriesData[i].evals[y][activites[1].name],juriesData[i].evals[y][activites[2].name]),
            name: juriesData[i].evals[y].name
          })
        }
        
        evals[y].total += getTotalPts(juriesData[i].evals[y][activites[0].name],juriesData[i].evals[y][activites[1].name],juriesData[i].evals[y][activites[2].name])
      }

    }
    console.log(evals);
    return evals;
  }
  
  const handleExport = (_) => {
    //console.log(JSON.stringify(data));
    tablesToExcel(['tab'], 'tab', 'tab')
  }

  const handleExports = (_) => {
    //console.log(JSON.stringify(data));
    console.log(data.map( (d, i)=> "tabs"+i ));
    tablesToExcel(data.map( (d, i)=> "tabs"+i ), 'tab', 'tab')
  }

  const getTotal = (_criteres) => {
    let sum = 0.0;
    for (const _ in _criteres) sum += _criteres[_] == '' ? 0 : parseFloat(_criteres[_])
    return parseFloat(sum / Object.keys(_criteres).length).toFixed(2) ;
  } 

  const getTotalPts = (..._criteres) => {
    let superTotal = 0.0;
    for (let i = 0; i < _criteres.length; i++) {
      superTotal = parseFloat(superTotal + parseFloat(getTotal(_criteres[i])))
      
    }
    
    return superTotal;
  }

  const img = "https://supmanagement.ml/wp-content/uploads/2021/06/logosup.png"
  const [aboutEval, setAboutEval] = useState(false)

  return (<>
    {screen != "sign" && (<div className='flex flex-col gap-4 w-full mx-auto min-h-screen items-center justify-center'>
      <div className={screen == 'eval' ? 'flex flex-col gap-4 max-w-2xl w-full mx-auto min-h-full items-center justify-center' : 'hidden'}>
      <Image loader={ () => img } src={img} height='250' width={560} alt="" />
      <h1>Notation communautaire journée culturelle</h1>
      <div className="flex flex-col gap-4 w-full">
          <Select variant="outlined" label="Communauté" >
            <Option onClick={ ()=> setSelectedCom(0) }>Ethnie</Option>
            <Option onClick={ ()=> setSelectedCom(1) }>Pays</Option>
          </Select>
        <div className="flex gap-4 w-full">
        {selectedCom != -1 && (<Select variant="static" label={selectedCom == 0 ? "Ethnie":"Pays"}>
          {data.filter( e => {
            if (selectedCom == 0) {
              return e.type == 'ethnie'
            } else if (selectedCom == 1) {
              return e.type == 'pays'
            }else return false
            } ).map( (e, i) => (<Option key={i} onClick={ ()=> setSelectedEval(i) }>{e.name}</Option>) )}
        </Select>)}
          
          <Select variant="standard" label="Activité">
            {activites.map( (a, i) => <Option key={i} onClick={ ()=> setSelectedActivity(i) }>{a.label}</Option> )}
          </Select>
        </div>
        {selectedActivity != -1 && (<Select variant="static" label="critère">
          {activites[selectedActivity].criteres.map( (c, i) => (<Option key={i} onClick={ ()=> setSelectedCritere(i)} >{c.label}</Option>) )}
        </Select>)}
      </div>
      { selectedEval != -1 && selectedActivity != -1 && selectedCritere != -1  &&(
      <>
      <div className='w-full flex flex-col gap-3 items-center'>
          <div className='h-16 mx-auto'>
            <Input label="Note (0 - 5)" className='' max={'5'} min={'0'} value={data[selectedEval][activites[selectedActivity].name][activites[selectedActivity].criteres[selectedCritere].name]} onChange={ handleSetData } /></div>
            <button type="button" onClick={()=> setAboutEval(!aboutEval) }>{aboutEval ? 'Masquer' : 'Détails'}</button>
            {aboutEval && (<div className='flex flex-col'>
              <Tab _eval={data[selectedEval]} activites={activites} />
              <button type="button" onClick={handleExport}>Exporter en excel</button>
            </div>)}

        
        </div>
        </>)}
        <button type="button" onClick={() => setScreen('allEvals')}>Classement</button>
      </div>
        {screen == 'allEvals' &&(<div className='flex flex-col items-center mx-auto justify-center w-screen min-h-screen'>
          <div className='flex gap-2'>
            <button type="button" onClick={ () => setScreen('eval')}>Retour</button>
            <button type="button" onClick={handleExports}>Exporter tous en excel</button>
          </div>
            <h1 className='underline'>Classement</h1>
            {
              getEvalsTotals(juriesData).sort((x, y) => y.total - x.total ).map( (ev, i) => (<div key={i} className="grid grid-cols-2 gap-2" >
              <span>{ev.name}</span> <span className='ml-6'>{ev.total} ({ i == 0 ? "1er" : (i+1)+"ème"})</span>
              </div>) )
            }
            <hr/>
            <h1 className='underline'>JURY A</h1>
            <div className='flex flex-wrap w-full mx-auto justify-center'>
            {juriesData.find(j => j.jury == 'A') && juriesData.find(j => j.jury == 'A').evals.sort( (eY, eX) => getTotalPts(eX[activites[0].name], eX[activites[1].name], eX[activites[2].name]) - getTotalPts(eY[activites[0].name], eY[activites[1].name], eY[activites[2].name]) ).map( (d,i)=> <Tab key={i} _eval={classementData[i]} index={i} activites={activites} /> )}
            </div>
            <hr/>
            <h1 className='underline'>JURY B</h1>
            <div className='flex flex-wrap w-full mx-auto justify-center'>
            {juriesData.find(j => { return j.jury == 'B'}) && juriesData.find(j => j.jury == 'B').evals.sort( (eY, eX) => getTotalPts(eX[activites[0].name], eX[activites[1].name], eX[activites[2].name]) - getTotalPts(eY[activites[0].name], eY[activites[1].name], eY[activites[2].name]) ).map( (d,i)=> <Tab key={i} _eval={classementData[i]} index={i} activites={activites} /> )}
            </div>
            {/*<hr/>
            <h1 className='underline'>JURY C</h1>
            <div className='flex flex-wrap w-full mx-auto justify-center'>
            {juriesData.find(j => j.jury == 'C') && juriesData.find(j => j.jury == 'C').evals.sort( (eY, eX) => getTotalPts(eX[activites[0].name], eX[activites[1].name], eX[activites[2].name]) - getTotalPts(eY[activites[0].name], eY[activites[1].name], eY[activites[2].name]) ).map( (d,i)=> <Tab key={i} _eval={classementData[i]} index={i} activites={activites} /> )}
          </div>*/}

          {/*<div className='flex flex-wrap w-full mx-auto justify-center'>
          {classementData.sort( (eY, eX) => getTotalPts(eX[activites[0].name], eX[activites[1].name], eX[activites[2].name]) - getTotalPts(eY[activites[0].name], eY[activites[1].name], eY[activites[2].name]) ).map( (d,i)=> <Tab key={i} _eval={classementData[i]} index={i} activites={activites} /> )}
      </div>*/}
        </div>)}
    </div>)}
    { screen == "sign" && (<div className='flex flex-col gap-4 w-full max-w-4xl mx-auto min-h-screen items-center justify-center'>
      <Image loader={ () => img } src={img} height='250' width={560} alt="" />
      <h1>Notation communautaire journée culturelle</h1>
      <div className='w-52'>
      <Select label="Jury">
        <Option onClick={ ()=> setJury('A') }>A</Option>
        <Option onClick={ ()=> setJury('B') }>B</Option>
        <Option onClick={ ()=> setJury('Admin') }>Administration</Option>
      </Select>
      </div>
      {jury != null && (<button  onClick={ ()=> setScreen('eval') } className="rounded relative inline-flex group items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-4 border-l-2 active:border-purple-600 active:shadow-none shadow-lg bg-gradient-to-tr from-purple-600 to-purple-500 border-purple-700 text-white">
        <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
        <span className="relative">Continuer</span>
      </button>)}
    </div>)}
    </>
  )
}
function Tab({_eval, activites, index = -1}){
  const getTotal = (_criteres) => {
    let sum = 0.0;
    for (const _ in _criteres) sum += _criteres[_] == '' ? 0 : parseFloat(_criteres[_])
    return parseFloat(sum / Object.keys(_criteres).length).toFixed(2) ;
  } 

  const getTotalPts = (..._criteres) => {
    let superTotal = 0.0;
    for (let i = 0; i < _criteres.length; i++) {
      superTotal = parseFloat(superTotal + parseFloat(getTotal(_criteres[i])))
      
    }
    
    return superTotal;
  }
  return <table cellSpacing={0} border={0} id={index != -1 ? "tabs"+index : 'tab'} style={{margin: '10px'}}>
  <colgroup span={3} width={89} />
  <tbody><tr>
    <td style={{ borderTop: '2px solid #000000', borderBottom: '1px solid #000000', borderLeft: '2px solid #000000', borderRight: '1px solid #000000' }} height={21} align="left" valign="bottom"><font face="Times Roman" color="#000000">ETHNIE :</font></td>
    <td style={{ borderTop: '2px solid #000000', borderBottom: '1px solid #000000', borderLeft: '1px solid #000000', borderRight: '2px solid #000000' }} colSpan={2} align="left" valign="bottom"><font face="Times Roman" color="#000000">
      {_eval.name}
    </font></td>
  </tr>
    <tr>
      <td style={{ borderTop: '1px solid #000000', borderBottom: '1px solid #000000', borderLeft: '2px solid #000000', borderRight: '2px solid #000000' }} colSpan={3} height={21} align="center" valign="bottom"><b><font face="Times Roman" color="#000000">PRESENTATION CUISINE</font></b></td>
    </tr>
    <tr>
      <td style={{ borderTop: '1px solid #000000', borderBottom: '1px solid #000000', borderLeft: '2px solid #000000', borderRight: '1px solid #000000' }} colSpan={2} height={21} align="left" valign="bottom"><font face="Times Roman" color="#000000">Présentation du service</font></td>
      <td style={{ borderTop: '1px solid #000000', borderBottom: '1px solid #000000', borderLeft: '1px solid #000000', borderRight: '2px solid #000000' }} align="left" valign="bottom"><font face="Times Roman" color="#000000">
      {_eval[activites[0].name][activites[0].criteres[0].name]}
        <br /></font></td>
    </tr>
    <tr>
      <td style={{ borderTop: '1px solid #000000', borderBottom: '1px solid #000000', borderLeft: '2px solid #000000', borderRight: '1px solid #000000' }} colSpan={2} height={21} align="left" valign="bottom"><font face="Times Roman" color="#000000">Présentation du plat</font></td>
      <td style={{ borderTop: '1px solid #000000', borderBottom: '1px solid #000000', borderLeft: '1px solid #000000', borderRight: '2px solid #000000' }} align="left" valign="bottom"><font face="Times Roman" color="#000000">
      {_eval[activites[0].name][activites[0].criteres[1].name]}
        <br /></font></td>
    </tr>
    <tr>
      <td style={{ borderTop: '1px solid #000000', borderBottom: '1px solid #000000', borderLeft: '2px solid #000000', borderRight: '1px solid #000000' }} colSpan={2} height={21} align="left" valign="bottom"><font face="Times Roman" color="#000000">Le Goût</font></td>
      <td style={{ borderTop: '1px solid #000000', borderBottom: '1px solid #000000', borderLeft: '1px solid #000000', borderRight: '2px solid #000000' }} align="left" valign="bottom"><font face="Times Roman" color="#000000">
      {_eval[activites[0].name][activites[0].criteres[2].name]}
        <br /></font></td>
    </tr>
    <tr>
      <td style={{ borderTop: '1px solid #000000', borderBottom: '1px solid #000000', borderLeft: '2px solid #000000', borderRight: '2px solid #000000' }} colSpan={3} height={21} align="center" valign="bottom"><b><font face="Times Roman" color="#000000">DANSE TRADITIONNELLE</font></b></td>
    </tr>
    <tr>
      <td style={{ borderTop: '1px solid #000000', borderBottom: '1px solid #000000', borderLeft: '2px solid #000000', borderRight: '1px solid #000000' }} colSpan={2} height={21} align="left" valign="bottom"><font face="Times Roman" color="#000000">Originalité</font></td>
      <td style={{ borderTop: '1px solid #000000', borderBottom: '1px solid #000000', borderLeft: '1px solid #000000', borderRight: '2px solid #000000' }} align="left" valign="bottom"><font face="Times Roman" color="#000000">
      {_eval[activites[1].name][activites[1].criteres[0].name]}
        <br /></font></td>
    </tr>
    <tr>
      <td style={{ borderTop: '1px solid #000000', borderBottom: '1px solid #000000', borderLeft: '2px solid #000000', borderRight: '1px solid #000000' }} colSpan={2} height={21} align="left" valign="bottom"><font face="Times Roman" color="#000000">Occupation scénique</font></td>
      <td style={{ borderTop: '1px solid #000000', borderBottom: '1px solid #000000', borderLeft: '1px solid #000000', borderRight: '2px solid #000000' }} align="left" valign="bottom"><font face="Times Roman" color="#000000">
      {_eval[activites[1].name][activites[1].criteres[1].name]}
        <br /></font></td>
    </tr>
    <tr>
      <td style={{ borderTop: '1px solid #000000', borderBottom: '1px solid #000000', borderLeft: '2px solid #000000', borderRight: '1px solid #000000' }} colSpan={2} height={21} align="left" valign="bottom"><font face="Times Roman" color="#000000">Expression du corps</font></td>
      <td style={{ borderTop: '1px solid #000000', borderBottom: '1px solid #000000', borderLeft: '1px solid #000000', borderRight: '2px solid #000000' }} align="left" valign="bottom"><font face="Times Roman" color="#000000">
      {_eval[activites[1].name][activites[1].criteres[2].name]}
        <br /></font></td>
    </tr>
    <tr>
      <td style={{ borderTop: '1px solid #000000', borderBottom: '1px solid #000000', borderLeft: '2px solid #000000', borderRight: '2px solid #000000' }} colSpan={3} height={21} align="center" valign="bottom"><b><font face="Times Roman" color="#000000">ORGANISATION DU GROUPE</font></b></td>
    </tr>
    <tr>
      <td style={{ borderTop: '1px solid #000000', borderBottom: '1px solid #000000', borderLeft: '2px solid #000000', borderRight: '1px solid #000000' }} colSpan={2} height={21} align="left" valign="bottom"><font face="Times Roman" color="#000000">Présentation du stand</font></td>
      <td style={{ borderTop: '1px solid #000000', borderBottom: '1px solid #000000', borderLeft: '1px solid #000000', borderRight: '2px solid #000000' }} align="left" valign="bottom"><font face="Times Roman" color="#000000">
      {_eval[activites[2].name][activites[2].criteres[0].name]}
        <br /></font></td>
    </tr>
    <tr>
      <td style={{ borderTop: '1px solid #000000', borderBottom: '1px solid #000000', borderLeft: '2px solid #000000', borderRight: '1px solid #000000' }} colSpan={2} height={21} align="left" valign="bottom"><font face="Times Roman" color="#000000">Orginalité de la décoration</font></td>
      <td style={{ borderTop: '1px solid #000000', borderBottom: '1px solid #000000', borderLeft: '1px solid #000000', borderRight: '2px solid #000000' }} align="left" valign="bottom"><font face="Times Roman" color="#000000">
      {_eval[activites[2].name][activites[2].criteres[1].name]}
        <br /></font></td>
    </tr>
    <tr>
      <td style={{ borderTop: '1px solid #000000', borderLeft: '2px solid #000000', borderRight: '1px solid #000000' }} colSpan={2} height={21} align="left" valign="bottom"><font face="Times Roman" color="#000000">Coordination des activités</font></td>
      <td style={{ borderTop: '1px solid #000000', borderLeft: '1px solid #000000', borderRight: '2px solid #000000' }} align="left" valign="bottom"><font face="Times Roman" color="#000000">
      {_eval[activites[2].name][activites[2].criteres[2].name]}
        <br /></font></td>
    </tr>
    <tr>
      <td style={{ borderTop: '2px solid #000000', borderBottom: '2px solid #000000', borderLeft: '2px solid #000000', borderRight: '1px solid #000000' }} colSpan={2} height={21} align="left" valign="bottom"><font face="Times Roman" color="#000000">TOTAL POINTS</font></td>
      <td style={{ borderTop: '2px solid #000000', borderBottom: '2px solid #000000', borderLeft: '1px solid #000000', borderRight: '2px solid #000000' }} align="left" valign="bottom"><font face="Times Roman" color="#000000">
      {getTotalPts(_eval[activites[0].name], _eval[activites[1].name], _eval[activites[2].name])}
      <br /></font></td>
    </tr>
  </tbody>
</table>
}