import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import styles from "./MultiSelect.module.css";

interface MultiSelectProps {
  /**
   * The complete list of string options available for selection.
   */
  options: string[];
  /**
   * The current list of selected items. This component is controlled:
   * the parent must manage and pass down selected items.
   */
  selectedItems: string[];
  /**
   * Callback when the selection changes. Receives the new array of selected items.
   */
  onChange: (items: string[]) => void;
  /**
   * Optional placeholder text for the search input.
   */
  placeholder?: string;
  /**
   * Optional className to further style the container.
   */
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedItems,
  onChange,
  placeholder = "Search or select an option...",
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Filter out already-selected items and anything not matching the searchTerm
  const filteredOptions = options.filter(
    (option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedItems.includes(option)
  );

  // Add an item to the selected list
  const handleSelectOption = (option: string) => {
    onChange([...selectedItems, option]);
    setSearchTerm("");
    setIsOpen(false);
  };

  // Remove a specific item from the selected list
  const handleRemoveItem = (itemToRemove: string) => {
    onChange(selectedItems.filter((item) => item !== itemToRemove));
  };

  // Check for Backspace at an empty search, then remove the last selected item
  const handleBackspace = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && searchTerm === "") {
      e.preventDefault(); // avoid browser’s "back" navigation
      if (selectedItems.length > 0) {
        onChange(selectedItems.slice(0, -1));
      }
    }
  };

  // Close dropdown when clicking outside the component
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative mt-0.5 ${className}`} ref={containerRef}>
      <div
        className="flex w-full rounded-md border-0 
                   text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                   focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600
                   sm:text-sm sm:leading-6 flex-wrap items-center gap-x-1 px-2"
        onClick={() => setIsOpen(true)}
      >
        {/* Display selected items as tag bubbles with an "×" icon */}
        {selectedItems.map((item, idx) => (
          <span
            key={`${item}-${idx}`}
            className="flex items-center bg-indigo-100 
                       rounded-full my-1 px-2 py-1 text-sm text-gray-700"
          >
            {item}
            <button
              type="button"
              className="ml-1 text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveItem(item);
              }}
            >
              &times;
            </button>
          </span>
        ))}

        {/* Search input */}
        <input
          type="text"
          className={`flex-1 bg-transparent border-none placeholder:text-gray-400 ${styles.noSelect}`}
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleBackspace}
        />
      </div>

      {/* Dropdown menu */}
      {isOpen && filteredOptions.length > 0 && (
        <div
          className="absolute w-full mt-1 rounded-md 
                     bg-white shadow-md ring-1 ring-black ring-opacity-5 z-10"
        >
          <ul className="py-1">
            {filteredOptions.map((option) => (
              <li
                key={option}
                className="cursor-pointer px-3 py-2 hover:bg-gray-100 
                           text-gray-700 text-sm"
                onClick={() => handleSelectOption(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
