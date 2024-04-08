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
import { useEffect, useState } from "react";

const years: { value: string; label: string }[] = [];
for (let i = 2007; i <= 2024; i++) {
  years.push({ value: i.toString(), label: i.toString() });
}

function App() {
  const [selectedStatistikkvariabel, setSelectedStatistikkvariabel] = useState<string[] | null>(null);
  const [selectedYears, setSelectedYears] = useState<string[] | null>([]);
  const [selectedRegion, setSelectedRegion] = useState<string[] | null>(null);

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
    console.log(result.data);
  };

  return (
    <>
      <p className="text-4xl">Hello World</p>

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
      <p>Region</p>
      <Select
        availableItemsList={[
          { label: "Molde (-2019)", value: "1502" },
          { label: "Molde", value: "1506" },
          { label: "Gloppen (-2019)", value: "1445" },
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
        className="bg-gray-50 text-white w-96 cursor-pointer p-2 "
      >
        Submit Query
      </div>
    </>
  );
}

export default App;
