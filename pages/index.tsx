import Head from "next/head";
import Image from "next/image";
import {
  Input,
  Select,
  Option,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { prisma } from "../prisma/prisma_global";
import { Eval as EvalDB } from "@prisma/client";
import { Button, Tab, TabList } from "@tremor/react";
import Eval from "../types/Eval";
import TabCard from "../componants/Tab";

import { Fragment } from "react";
import { Disclosure, Menu, Popover, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

export async function getServerSideProps({ req, res }) {
  let evals = null;
  if (req.cookies?.jury) {
    let evalData: EvalDB = await prisma.eval.findFirst({
      where: {
        jury: req.cookies?.jury,
      },
    });

    if (evalData) evals = JSON.parse(String(evalData.evals));
  }

  return {
    props: {
      _jury: req.cookies?.jury || null,
      evals,
    },
  };
}

function deleteCookie(cookieName) {
  document.cookie =
    cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export default function Home({ _jury, evals }) {
  const [activeEval, setActiveEval] = useState(-1);

  const [data, setData] = useState<Eval[]>(
    evals || [
      new Eval("ethnie", "FORGERON"),
      new Eval("ethnie", "MALINKE/KASSONKE"),
      new Eval("ethnie", "BOZO"),
      new Eval("ethnie", "DOGON"),
      new Eval("ethnie", "SENOUFO"),
      new Eval("ethnie", "PEULH"),
      new Eval("ethnie", "SONINKE"),
      new Eval("ethnie", "BAMBARA"),
      new Eval("ethnie", "SONRAI"),
      new Eval("ethnie", "TAMACHEK"),
      new Eval("ethnie", "DJOKARAME"),

      new Eval("pays", "GABON", "/images/gabon.png"),
      new Eval("pays", "COTE D'IVOIRE", "/images/cote-d-ivoire.png"),
      new Eval("pays", "BURKINA FASSO", "/images/burkina-fasso.png"),
      new Eval("pays", "AFRIQUE DU SUD", "/images/afrique-du-sud.png"),
      new Eval("pays", "CAMEROUN", "/images/cameroun.png"),
      new Eval("pays", "GUINEE", "/images/guinee.png"),
      new Eval("pays", "MADAGASCAR", "/images/madagascar.png"),
      new Eval("pays", "SENEGAL", "/images/senegal.png"),
      new Eval("pays", "TOGO", "/images/togo.png"),
      new Eval("pays", "NIGER", "/images/niger.png"),
      new Eval("pays", "NIGERIA", "/images/nigeria.png"),
    ]
  );
  const [classementData, setClassementData] = useState(data);
  const [isJuriesDataLoading, setIsJuriesDataLoading] = useState(true);

  const [juriesData, setJuriesData] = useState(null);

  const getJuriesData = () => {
    if (jury == "Admin") {
      // setIsJuriesDataLoading(true);
      axios.post("/api/get-save").then(({ data }) => {
        if (data) {
          setJuriesData(data);
        }
        setIsJuriesDataLoading(false);
      });
    }
  };

  useEffect(() => {
    getJuriesData();
    setInterval(() => {
      getJuriesData();
    }, 5000);
  }, []);

  const [selectedCom, setSelectedCom] = useState(-1);
  const [selectedEval, setSelectedEval] = useState(undefined);
  const [selectedActivity, setSelectedActivity] = useState(0);
  const [selectedCritere, setSelectedCritere] = useState(0);

  const activites = [
    {
      name: "cuisine",
      label: "PRESENTATION CUISINE",
      icon: Kitchen,
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
      ],
    },
    {
      name: "danse",
      label: "DANSE TRADITIONNELLE",
      icon: Dance,
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
      ],
    },
    {
      name: "organisation_group",
      label: "ORGANISATION DU GROUPE",
      icon: Organisation,
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
      ],
    },
  ];

  var tablesToExcel = (function () {
    var uri = "data:application/vnd.ms-excel;base64,",
      template =
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>',
      templateend =
        '</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head>',
      body = "<body>",
      tablevar = "<table>{table",
      tablevarend = "}</table>",
      bodyend = "</body></html>",
      worksheet = "<x:ExcelWorksheet><x:Name>",
      worksheetend =
        "</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>",
      worksheetvar = "{worksheet",
      worksheetvarend = "}",
      base64 = function (s) {
        return window.btoa(unescape(encodeURIComponent(s)));
      },
      format = function (s, c) {
        return s.replace(/{(\w+)}/g, function (m, p) {
          return c[p];
        });
      },
      wstemplate = "",
      tabletemplate = "";

    return function (table, name, filename) {
      var tables = table;

      for (var i = 0; i < tables.length; ++i) {
        wstemplate +=
          worksheet + worksheetvar + i + worksheetvarend + worksheetend;
        tabletemplate += tablevar + i + tablevarend;
      }

      var allTemplate = template + wstemplate + templateend;
      var allWorksheet = body + tabletemplate + bodyend;
      var allOfIt = allTemplate + allWorksheet;

      var ctx = {};
      for (var j = 0; j < tables.length; ++j) {
        ctx["worksheet" + j] = name[j];
      }

      for (var k = 0; k < tables.length; ++k) {
        var exceltable;
        if (!tables[k].nodeType)
          exceltable = document.getElementById(tables[k]);
        ctx["table" + k] = exceltable.innerHTML;
      }

      //document.getElementById("dlink").href = uri + base64(format(template, ctx));
      //document.getElementById("dlink").download = filename;
      //document.getElementById("dlink").click();

      window.location.href = uri + base64(format(allOfIt, ctx));
    };
  })();

  const [jury, setJury] = useState(_jury);
  const [screen, setScreen] = useState(
    jury == null || jury == "null" ? "sign" : "eval"
  );

  useEffect(() => {
    if (jury != null && jury != "Admin")
      axios.post("/api/save", { data, jury: jury });
  }, [data]);

  useEffect(() => {
    axios.post("/api/save-jury-state", { jury: jury });
  }, [jury]);

  const handleSetData = (_) => {
    setData(
      [...data].map((e, i) => {
        if (i == selectedEval) {
          e[activites[selectedActivity].name][
            activites[selectedActivity].criteres[selectedCritere].name
          ] = _.currentTarget.value;
          return e;
        } else return e;
      })
    );
    setClassementData(data);
  };

  const getEvalsTotals = (juriesData) => {
    console.log(juriesData);

    let evals = [];
    for (let i = 0; i < juriesData.length; i++) {
      for (let y = 0; y < juriesData[i].evals.length; y++) {
        if (i == 0) {
          evals.push({
            total: getTotalPts(
              juriesData.length,
              juriesData[i].evals[y][activites[0].name],
              juriesData[i].evals[y][activites[1].name],
              juriesData[i].evals[y][activites[2].name]
            ),
            name: juriesData[i].evals[y].name,
          });
          continue;
        }

        evals[y].total += getTotalPts(
          juriesData.length,
          juriesData[i].evals[y][activites[0].name],
          juriesData[i].evals[y][activites[1].name],
          juriesData[i].evals[y][activites[2].name]
        );
      }
    }
    return evals.map((ev) => {
      ev.total = (ev.total / juriesData.length).toFixed(2);
      return ev;
    });
  };

  const handleExport = (_) => {
    //console.log(JSON.stringify(data));
    tablesToExcel(["tab"], "tab", "tab");
  };

  const handleExports = (_) => {
    //console.log(JSON.stringify(data));
    // console.log(data.map((d, i) => "tabs" + i));
    tablesToExcel(
      data.map((d, i) => "tabs" + i),
      "tab",
      "tab"
    );
  };

  const getTotal = (_criteres: string[]) => {
    let sum = 0.0;
    for (const _ in _criteres)
      sum += _criteres[_] == "" ? 0 : parseFloat(_criteres[_]);
    return parseFloat(String(sum / Object.keys(_criteres).length)).toFixed(2);
  };

  const getTotalPts = (nbrJuries, ..._criteres) => {
    let superTotal = 0.0;
    for (let i = 0; i < _criteres.length; i++) {
      superTotal = parseFloat(
        String(superTotal + parseFloat(getTotal(_criteres[i])))
      );
    }

    return superTotal + 5;
  };

  const img = "/logo.png";
  const [aboutEval, setAboutEval] = useState(false);

  // 10 nice Hex different colors on what text are lisible
  const colors = [
    "#264653",
    "#344e41",
    "#283618",
    "#9b2226",
    "#ef476f",
    "#99582a",
    "#1b4965",
    "#007f5f",
    "#3d348b",
    "#bb9457",
  ];

  function getColorById(id) {
    // use the modulo operator to ensure the ID is within the range of the colors array
    const index = id % colors.length;
    return colors[index];
  }

  function acronymize(str) {
    const words = str.split(" ");
    const acronym = words.reduce((result, word) => result + word[0], "");
    return acronym.toUpperCase();
  }
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      {screen == "eval" && (
        <>
          <div className="flex flex-col w-full mx-auto min-h-screen bg-grey-100">
            <h1 className="text-2xl text-center text-white bg-amber-700 py-2">
              Notation communautaire journée culturelle (
              {jury != "Admin" && "Jury "}
              {jury})
            </h1>
            {/* <div className="relative w-full max-w-2xl m-auto h-0 pb-[56.25%]">
              <Image loader={() => img} src={img} layout="fill" alt="" />
            </div> */}
            <Disclosure as="nav" className="bg-white shadow">
              {({ open }) => (
                <>
                  <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 justify-between">
                      {jury != "Admin" && (
                        <div className=" inset-y-0 left-0 flex items-center sm:hidden">
                          {/* Mobile menu button */}
                          <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            {open ? (
                              <XMarkIcon
                                className="block h-6 w-6"
                                aria-hidden="true"
                              />
                            ) : (
                              <Bars3Icon
                                className="block h-6 w-6"
                                aria-hidden="true"
                              />
                            )}
                          </Disclosure.Button>
                        </div>
                      )}
                      <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 items-center">
                          <Image
                            loader={() => img}
                            src={img}
                            height={32}
                            width={32}
                            alt=""
                          />
                        </div>
                        {jury != "Admin" && (
                          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                            {activites.map((act, i) => (
                              <button
                                key={`btn${i}`}
                                onClick={() => setSelectedActivity(i)}
                                className={`inline-flex items-center border-b-2  px-1 pt-1 text-sm font-medium ${
                                  selectedActivity == i
                                    ? "text-gray-900 border-indigo-500"
                                    : "text-gray-500 hover:border-gray-300 hover:text-gray-700 border-transparent"
                                } `}
                              >
                                {act.label}
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="ml-auto flex items-center gap-2">
                          {/* {jury == "Admin" && (
                            <button
                              type="button"
                              className="flex items-center gap-2 rounded-full shadow-md px-4 py-2"
                              onClick={() => setScreen("allEvals")}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 512 512"
                              >
                                <path
                                  fill="currentColor"
                                  d="M104 496H72a24 24 0 0 1-24-24V328a24 24 0 0 1 24-24h32a24 24 0 0 1 24 24v144a24 24 0 0 1-24 24Zm224 0h-32a24 24 0 0 1-24-24V232a24 24 0 0 1 24-24h32a24 24 0 0 1 24 24v240a24 24 0 0 1-24 24Zm112 0h-32a24 24 0 0 1-24-24V120a24 24 0 0 1 24-24h32a24 24 0 0 1 24 24v352a24 24 0 0 1-24 24Zm-224 0h-32a24 24 0 0 1-24-24V40a24 24 0 0 1 24-24h32a24 24 0 0 1 24 24v432a24 24 0 0 1-24 24Z"
                                />
                              </svg>
                              <span>Classement</span>
                            </button>
                          )} */}
                          <button
                            className="flex items-center gap-2 rounded-full shadow-md px-4 py-2"
                            onClick={() => {
                              deleteCookie("jury");
                              document.location.reload();
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              viewBox="0 0 256 256"
                            >
                              <path
                                fill="currentColor"
                                d="m250.83 130.83l-24 24a4 4 0 0 1-5.66 0l-24-24a4 4 0 1 1 5.66-5.66L220 142.34V128A92 92 0 0 0 53.25 74.34a4 4 0 0 1-6.5-4.68A100 100 0 0 1 228 128v14.34l17.17-17.17a4 4 0 1 1 5.66 5.66Zm-41.6 55.51A100 100 0 0 1 28 128v-14.34l-17.17 17.17a4 4 0 0 1-5.66-5.66l24-24a4 4 0 0 1 5.66 0l24 24a4 4 0 0 1-5.66 5.66L36 113.66V128a91.69 91.69 0 0 0 26.83 64.87a75.61 75.61 0 0 1 44.51-34a44 44 0 1 1 41.32 0a75.57 75.57 0 0 1 44.52 34.07a91.34 91.34 0 0 0 9.56-11.24a4 4 0 1 1 6.49 4.68ZM128 156a36 36 0 1 0-36-36a36 36 0 0 0 36 36Zm0 64a92.23 92.23 0 0 0 59.14-21.57a68 68 0 0 0-118.27 0A91.56 91.56 0 0 0 128 220Z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {jury != "Admin" && (
                    <Disclosure.Panel className="sm:hidden">
                      <div className="space-y-1 pb-4 pt-2 flex flex-col">
                        {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
                        {activites.map((act, i) => (
                          <Disclosure.Button
                            key={`btn-${i}`}
                            as="button"
                            onClick={() => setSelectedActivity(i)}
                            className={`inline-flex items-center border-l-4 px-1 py-2 text-sm font-medium ${
                              selectedActivity == i
                                ? "text-grey-900 border-indigo-500"
                                : "text-grey-700 hover:border-grey-300 hover:text-grey-900 border-transparent"
                            } `}
                          >
                            {act.label}
                          </Disclosure.Button>
                        ))}
                      </div>
                    </Disclosure.Panel>
                  )}
                </>
              )}
            </Disclosure>

            {jury == "Admin" && (
              //  && screen == "allEvals"
              <div className="flex flex-col items-center mx-auto justify-center w-screen min-h-screen">
                {/* <div className="flex gap-2">
            <button type="button" onClick={() => setScreen("eval")}>
              Retour
            </button>
          </div> */}
                <h1 className="underline mb-4 text-2xl">Classement</h1>
                {!isJuriesDataLoading &&
                  getEvalsTotals(juriesData)
                    .sort((x, y) => y.total - x.total)
                    .map((ev, i) => (
                      <div key={i} className="grid grid-cols-5 gap-4">
                        <span className="col-span-3 text-xl text-right">
                          {ev.name}
                        </span>{" "}
                        <span className="ml-6 col-span-2 text-xl">
                          {ev.total} ({i == 0 ? "1er" : i + 1 + "ème"})
                        </span>
                      </div>
                    ))}
                {isJuriesDataLoading && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="15"
                      strokeDashoffset="15"
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M12 3C16.9706 3 21 7.02944 21 12"
                    >
                      <animate
                        fill="freeze"
                        attributeName="stroke-dashoffset"
                        dur="0.3s"
                        values="15;0"
                      />
                      <animateTransform
                        attributeName="transform"
                        dur="1.5s"
                        repeatCount="indefinite"
                        type="rotate"
                        values="0 12 12;360 12 12"
                      />
                    </path>
                  </svg>
                )}
              </div>
            )}

            {jury != "Admin" && (
              <div
                className={
                  "flex flex-col max-w-4xl w-full mx-auto px-2 min-h-full items-center justify-center"
                }
              >
                {selectedEval == undefined && (
                  <div className="flex flex-col gap-4 w-full">
                    <h1 className="text-2xl text-center mt-6 mb-4">
                      Selectionnez une communauté
                    </h1>
                    <div className="relative mb-4">
                      <div
                        className="absolute inset-0 flex items-center"
                        aria-hidden="true"
                      >
                        <div className="w-full border-t border-grey-300" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-grey-100 px-2 text-sm text-gray-500">
                          Ethnie
                        </span>
                      </div>
                    </div>
                    <div
                      role="list"
                      className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8"
                    >
                      {data
                        .filter((e) => e.type == "ethnie")
                        .map((origin, i) => (
                          <button
                            key={`ethnie-${i}`}
                            className="relative"
                            onClick={() => setSelectedEval(i)}
                          >
                            <div className="group aspect-h-7 aspect-w-10 h-24 w-full overflow-hidden shadow-md rounded bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 flex">
                              <div
                                style={{ backgroundColor: getColorById(i) }}
                                className={classNames(
                                  "flex flex-1 items-center justify-center text-sm text-white group-hover:opacity-75"
                                )}
                              >
                                {origin.name}
                              </div>
                            </div>
                          </button>
                        ))}
                    </div>
                    <div className="relative my-4">
                      <div
                        className="absolute inset-0 flex items-center"
                        aria-hidden="true"
                      >
                        <div className="w-full border-t border-grey-300" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-grey-100 px-2 text-sm text-gray-500">
                          Pays
                        </span>
                      </div>
                    </div>
                    <div
                      role="list"
                      className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8"
                    >
                      {data
                        .filter((e) => e.type == "pays")
                        .map((origin, i) => (
                          <button
                            key={`pays-${i}`}
                            className="relative"
                            onClick={() => setSelectedEval(10 + i)}
                          >
                            <div className="group aspect-h-7 aspect-w-10 block w-full h-24 shadow-md overflow-hidden rounded bg-gray-100 relative">
                              <Image
                                src={origin?.image_url}
                                alt={origin?.image_url}
                                layout="fill"
                                className="pointer-events-none object-cover group-hover:opacity-75"
                              />
                            </div>
                            <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
                              {origin.name}
                            </p>
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {selectedEval != undefined && (
                  <div className="w-full mt-4 flex flex-col">
                    <div>
                      <button
                        type="button"
                        onClick={() => setSelectedEval(undefined)}
                        className="rounded-md flex items-center mx-auto gap-2 mb-4 bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-grey-300 hover:bg-grey-50"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="m9 18l-6-6l6-6l1.4 1.4L6.8 11H21v2H6.8l3.6 3.6L9 18Z"
                          />
                        </svg>
                        <span>Retour a la selection communautaire</span>
                      </button>
                    </div>

                    <div className="sm:hidden">
                      <label htmlFor="tabs" className="sr-only">
                        Selectionnez un critere
                      </label>
                      {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                      <select
                        id="tabs"
                        name="tabs"
                        className="block w-full h-10 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        defaultValue={
                          activites[selectedActivity].criteres[0].name
                        }
                      >
                        {activites[selectedActivity].criteres.map((tab) => (
                          <option key={tab.name}>{tab.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="hidden sm:block">
                      <nav
                        className="isolate flex divide-x divide-grey-200 rounded-lg shadow"
                        aria-label="Tabs"
                      >
                        {activites[selectedActivity].criteres.map(
                          (tab, tabIdx) => (
                            <button
                              onClick={() => setSelectedCritere(tabIdx)}
                              key={tab.name}
                              className={classNames(
                                tabIdx == selectedCritere
                                  ? "text-gray-900"
                                  : "text-gray-500 hover:text-gray-700",
                                tabIdx === 0 ? "rounded-l-lg" : "",
                                tabIdx ===
                                  activites[selectedActivity].criteres.length -
                                    1
                                  ? "rounded-r-lg"
                                  : "",
                                "group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10"
                              )}
                              aria-current={
                                tabIdx == selectedCritere ? "page" : undefined
                              }
                            >
                              <span>{tab.label}</span>
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  tabIdx == selectedCritere
                                    ? "bg-indigo-500"
                                    : "bg-transparent",
                                  "absolute inset-x-0 bottom-0 h-0.5"
                                )}
                              />
                            </button>
                          )
                        )}
                      </nav>
                    </div>
                  </div>
                )}
                {selectedEval != undefined && (
                  <div className="w-full flex flex-col gap-3 items-center bg-white p-4 shadow">
                    <div className="flex w-full gap-8 sm:gap-0 sm:flex-row flex-col">
                      <div className="w-full flex justify-center gap-4 flex-col items-center">
                        {/* <p className="text-xl px-2 pb-4 leading-8 grid grid-cols-5 space-x-2">
                        <span className="text-right col-span-2">
                          Note pour le critère:{" "}
                        </span>
                        <span className="col-span-3">
                          {
                            activites[selectedActivity].criteres[
                              selectedCritere
                            ].label
                          }
                        </span>
                        <span className="text-right col-span-2">
                          Pour la communauté:
                        </span>
                        <span className="col-span-3">
                          {data[selectedEval].name}
                        </span>
                        <span className="text-right col-span-2">
                          Concernant l'activité:
                        </span>
                        <span className="col-span-3">
                          {activites[selectedActivity].label}
                        </span>
                      </p> */}
                        <div className="h-20 mx-auto ">
                          <Input
                            label="Note (0 - 5)"
                            className=""
                            max="5"
                            min="0"
                            value={
                              data[selectedEval][
                                activites[selectedActivity].name
                              ][
                                activites[selectedActivity].criteres[
                                  selectedCritere
                                ].name
                              ]
                            }
                            style={{
                              height: "100px",
                              lineHeight: "100px",
                              fontSize: "3rem",
                              width: "200px",
                            }}
                            onChange={handleSetData}
                          />
                        </div>
                      </div>
                      {data[selectedEval].type == "ethnie" ? (
                        <div className="relative mx-auto">
                          <div className="group aspect-h-7 aspect-w-10 w-72 h-52 overflow-hidden shadow-md rounded bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 flex">
                            <div
                              style={{
                                backgroundColor: getColorById(selectedEval),
                              }}
                              className={classNames(
                                "flex flex-1 items-center justify-center text-xl font-medium text-white group-hover:opacity-75"
                              )}
                            >
                              {data[selectedEval].name}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative flex flex-col mx-auto">
                          <div className="group aspect-h-7 aspect-w-10 block w-72 h-52 shadow-md overflow-hidden rounded bg-gray-100 relative">
                            <Image
                              src={data[selectedEval]?.image_url}
                              alt={data[selectedEval]?.image_url}
                              layout="fill"
                              className="pointer-events-none object-cover group-hover:opacity-75"
                            />
                          </div>
                          <p className="pointer-events-none text-center mt-2 block text-xl font-medium text-gray-900">
                            {data[selectedEval].name}
                          </p>
                        </div>
                      )}
                    </div>

                    {jury == "Admin" && (
                      <button
                        type="button"
                        onClick={() => setAboutEval(!aboutEval)}
                      >
                        {aboutEval ? "Masquer" : "Détails"}
                      </button>
                    )}
                    {jury == "Admin" && aboutEval && (
                      <div className="flex flex-col">
                        <TabCard
                          _eval={data[selectedEval]}
                          activites={activites}
                        />
                        <button type="button" onClick={handleExport}>
                          Exporter en excel
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
      {screen == "sign" && (
        <>
          <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto min-h-screen items-center justify-center">
            <Image
              loader={() => img}
              src={img}
              height="350"
              width={560}
              alt=""
            />
            <h1>Notation communautaire journée culturelle</h1>
            <div className="w-52">
              <Select label="Jury">
                <Option onClick={() => setJury("A")}>A</Option>
                <Option onClick={() => setJury("B")}>B</Option>
                <Option onClick={() => setJury("C")}>C</Option>
                <Option onClick={() => setJury("Admin")}>Administration</Option>
              </Select>
            </div>
            {jury != null && (
              <button
                onClick={() => document.location.reload()}
                className="rounded relative inline-flex group items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-4 border-l-2 active:border-purple-600 active:shadow-none shadow-lg bg-gradient-to-tr from-purple-600 to-purple-500 border-purple-700 text-white"
              >
                <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
                <span className="relative">Continuer</span>
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}

export function Kitchen(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 14 14"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="10.6" cy="3.5" rx="2.4" ry="3"></ellipse>
        <path d="M10.6 6.5v7M3.5.5v13M6 .5V3a2.5 2.5 0 0 1-2.5 2.5h0A2.5 2.5 0 0 1 1 3V.5"></path>
      </g>
    </svg>
  );
}

export function Dance(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M17 17h-2v6h-2v-6h-2.12l-1.54 1.93l2.37 2.36l-1.42 1.42l-2.36-2.37c-.35-.34-.55-.81-.58-1.3c-.03-.49.12-.98.43-1.36l.54-.68H7l2-4v-3c-.62.47-1.12 1.07-1.47 1.76c-.35.7-.53 1.46-.53 2.24H5a7.001 7.001 0 0 1 7-7c1.33 0 2.6-.53 3.54-1.46C16.47 4.6 17 3.33 17 2h2c0 1.32-.38 2.62-1.09 3.73A6.982 6.982 0 0 1 15 8.31V13l2 4M14 4c0 .4-.12.78-.34 1.11c-.22.33-.53.59-.89.74a2.004 2.004 0 0 1-2.18-.44c-.28-.28-.47-.63-.55-1.02c-.08-.39-.04-.79.11-1.15c.15-.37.41-.68.74-.9c.33-.22.71-.34 1.11-.34c.53 0 1.04.21 1.41.59c.38.37.59.88.59 1.41Z"
      ></path>
    </svg>
  );
}

export function Organisation(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6.75 1.75h3.5v3.5h-3.5zm4 9h3.5v3.5h-3.5zm-8 0h3.5v3.5h-3.5zm5.75-5v2m-3.75 2.5v-2h7.5v2"
      ></path>
    </svg>
  );
}
