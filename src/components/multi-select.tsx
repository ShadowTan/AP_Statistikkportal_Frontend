import { useState, FC, useEffect } from "react";
import Select, { MultiValue } from "react-select";

interface MultiSelectProps {
  availableItemsList: { value: string; label: string }[];
  setUseState: React.Dispatch<React.SetStateAction<{ value: string; label: string }[] | null>>;
}

const MultiSelect: FC<MultiSelectProps> = ({ availableItemsList, setUseState }) => {
  const [selectedOptions, setSelectedOption] = useState<MultiValue<{
    value: string;
    label: string;
  }> | null>(null);

  useEffect(() => {
    setUseState(selectedOptions as { value: string; label: string }[] | null);
  }, [selectedOptions]);

  return (
    <>
      <Select
        className=" w-96"
        tabIndex={3}
        styles={{ menu: (provided) => ({ ...provided, zIndex: 9999 }) }}
        placeholder={"Choose Values"}
        value={selectedOptions}
        isMulti
        options={availableItemsList || []} // Fix: Ensure options is an array
        maxMenuHeight={150}
        onChange={setSelectedOption}
        noOptionsMessage={({ inputValue }) => `No result found for "${inputValue}"`}
      />
    </>
  );
};

export default MultiSelect;
