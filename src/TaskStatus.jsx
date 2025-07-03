import React from "react";

const Dropdown = ({ selected, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const options = ["TODO", "IN_PROGRESS", "DONE", "IN_QA", "DEPLOYED"];

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white border rounded shadow-sm hover:bg-gray-100 w-full text-left"
      >
        {selected}
        <span className="float-right">&#x25BC;</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md shadow-lg bg-white border left-0 top-full">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
