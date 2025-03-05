import React, { useState } from "react";

import Modal from "@frontend/src/components/modal";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface FilterSelectOptionProps<T> {
  title: string;
  subtitle: string;
  onSelected?: (value: T) => void;
  value: T;
}

function FilterSelectOption<T>({
  title,
  subtitle,
  value,
  onSelected,
}: FilterSelectOptionProps<T>) {
  return (
    <li className="col-span-1 flex rounded-md shadow-sm">
      <div className="flex flex-1 items-center justify-between truncate rounded-md border border-gray-200 bg-white">
        <div className="flex-1 truncate px-4 py-2 text-sm">
          <a className="font-medium text-gray-900 hover:text-gray-600">
            {title}
          </a>
          <p className={`text-gray-500`}>{subtitle}</p>
        </div>
        <div className="flex-shrink-0 pr-2">
          <button
            onClick={() => onSelected?.(value)}
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span className="sr-only">select option</span>
            <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  );
}

export type FilterSelectOptionData<T> = Omit<
  FilterSelectOptionProps<T>,
  "onSelected"
>;

interface FilterSelectProps<T> {
  onChange?: (value: T) => void;
  isOpen: boolean;
  data: FilterSelectOptionData<T>[];
  onClose?: () => void;
}

function FilterSelect<T>({
  isOpen,
  onClose,
  onChange,
  data,
}: FilterSelectProps<T>) {
  const [search, setSearch] = useState("");
  const filteredData = data.filter(
    (option) =>
      option.title.toLowerCase().includes(search.toLowerCase()) ||
      option.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col max-h-[80vh] min-h-[80vh] gap-y-3">
        <div className="w-full">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Search
          </label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            name="search"
            type="text"
            placeholder="Filter..."
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </div>
        <div className="w-full flex flex-col gap-y-2 overflow-y-auto">
          {filteredData &&
            filteredData.map((option) => (
              <FilterSelectOption
                {...option}
                key={option.title}
                onSelected={onChange}
              />
            ))}

          {filteredData.length === 0 && (
            <p className="text-center">No results found</p>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default FilterSelect;
