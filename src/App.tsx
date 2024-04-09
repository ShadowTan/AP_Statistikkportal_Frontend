/**
 * 
• Hent data fra https://www.ssb.no/statbank/table/11342

• https://data.ssb.no/api/v0/no/console

• Ta inn brukerinput gjennom browseren
  • Hardkod eller la bruker velge statistikkvariabel
  • Velg “kommune” eller “fylke” som parameter
  • To eller flere kommuner (eller fylker)
  • Hvilke 3 år eller sekvens av år

•Hent data fra SSB til serveren, og utfør beregninger som gir deg
median, gjennomsnitt, maksimum og minimum for valgte parameter

• Presenter resultatene i browseren i en tabell

 */
import axios from "axios";

import "./index.css";

import Select from "./components/multi-select";
import MakeTable from "./components/MakeTable";

import { useEffect, useState } from "react";

const years: { value: string; label: string }[] = [];
for (let i = 2007; i <= 2024; i++) {
  years.push({ value: i.toString(), label: i.toString() });
}

function App() {
  const [selectedStatistikkvariabel, setSelectedStatistikkvariabel] = useState<string[] | null>(null);
  const [selectedYears, setSelectedYears] = useState<string[] | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string[] | null>(null);

  const [selectedStatistikkvariabelTable, setSelectedStatistikkvariabelTable] = useState<string[] | null>(null);
  const [selectedYearsTable, setSelectedYearsTable] = useState<string[] | null>(null);
  const [selectedRegionTable, setSelectedRegionTable] = useState<string[] | null>(null);
  const [tableData, setTableData] = useState<string[] | null>(null);

  useEffect(() => {
    const submitButton = document.getElementById("submit");
    if (!submitButton) {
      console.log("Submit button is gone");
      return;
    }
    if (!selectedStatistikkvariabel || !selectedYears || !selectedRegion) {
      console.log("Hi");
      submitButton.classList.remove("bg-green-500");
      submitButton.classList.add("bg-gray-50");

      return;
    } else {
      submitButton.classList.remove("bg-gray-50");
      submitButton.classList.add("bg-green-500");
      return;
    }
  }, [selectedStatistikkvariabel, selectedYears, selectedRegion]);

  const doQuery = async () => {
    console.log("Doing request");
    if (!selectedStatistikkvariabel || !selectedYears || !selectedRegion) {
      return;
    }
    const StatistikkvariabelValues = selectedStatistikkvariabel.map((item) => item.value);
    const YearsValues = selectedYears.map((items) => items.value);
    const RegionValues = selectedRegion.map((items) => items.value);
    console.log(StatistikkvariabelValues, YearsValues, RegionValues);
    const result: any = await axios.post(
      "https://data.ssb.no/api/v0/no/table/11342",
      {
        query: [
          {
            code: "Region",
            selection: {
              filter: "item",
              values: RegionValues,
            },
          },
          {
            code: "ContentsCode",
            selection: {
              filter: "item",
              values: StatistikkvariabelValues,
            },
          },
          {
            code: "Tid",
            selection: {
              filter: "item",
              values: YearsValues,
            },
          },
        ],
        response: {
          format: "json-stat2",
        },
      },
      {
        headers: {},
      }
    );
    // console.log(result.data);
    console.log(result.data.dimension.Region.category);
    console.log(result.data.value);
    const regionValues: string[] = Object.values(result.data.dimension.Region.category.label);
    const yearsValues: string[] = Object.values(result.data.dimension.Tid.category.label);

    setSelectedStatistikkvariabelTable(StatistikkvariabelValues);
    setSelectedYearsTable(yearsValues.map((item) => item));
    setSelectedRegionTable(regionValues.map((item) => item));
    setTableData(result.data.value);
  };

  return (
    <>
      <div className="flex flex-row bg-slate-200">
        <div className="border-2 border-red-500 h-screen">
          <p className="text-4xl p-2">
            Befolkning: data fra{" "}
            <a className=" text-blue-500 underline" href="https://www.ssb.no/statbank/table/11342">
              SSB
            </a>
          </p>

          <p>Statistikkvariabel</p>
          <Select
            availableItemsList={[
              { label: "Befolkning per 1.1. (personer)", value: "Folkemengde" },
              { label: "Areal (km²)", value: "ArealKm2" },
              { label: "Landareal (km²)", value: "LandArealKm2" },
              { label: "Innbyggere per km² landareal", value: "FolkeLandArealKm2" },
            ]}
            setUseState={
              setSelectedStatistikkvariabel as React.Dispatch<
                React.SetStateAction<{ value: string; label: string }[] | null>
              >
            }
          ></Select>
          <p>År</p>
          <Select
            availableItemsList={years}
            setUseState={
              setSelectedYears as React.Dispatch<React.SetStateAction<{ value: string; label: string }[] | null>>
            }
          ></Select>
          <p>Region (Legg inn option for Kommune eller Fylke)</p>
          <Select
            availableItemsList={[
              { label: "Molde (-2019)", value: "1502" },
              { label: "Molde", value: "1506" },
              { label: "Gloppen (-2019)", value: "1445" },
              { label: "Ås", value: "3218" },
              { label: "Oslo", value: "0301" },
              { label: "Halden", value: "3101" },
            ]}
            setUseState={
              setSelectedRegion as React.Dispatch<React.SetStateAction<{ value: string; label: string }[] | null>>
            }
          ></Select>
          <div
            id="submit"
            onClick={() => {
              doQuery();
            }}
            className="bg-gray-50 text-black w-96 cursor-pointer p-2 "
          >
            Submit Query
          </div>
        </div>
        <div className="flex border-2 border-red-500 w-screen justify-center items-center">
          <MakeTable
            tableHeader={selectedStatistikkvariabelTable}
            tableYears={selectedYearsTable}
            row={selectedRegionTable}
            items={tableData}
          ></MakeTable>
        </div>
      </div>
    </>
  );
}

export default App;
