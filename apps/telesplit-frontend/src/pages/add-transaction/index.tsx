import React, { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/16/solid";
import FilterSelect, {
  FilterSelectOptionData,
} from "@frontend/src/components/filter-select";
import { allCurrencies } from "./currencies";

const AddTransaction = () => {
  const currencies: FilterSelectOptionData<string>[] = Object.keys(
    allCurrencies
  ).map((key) => ({
    title: allCurrencies[key].name,
    subtitle: allCurrencies[key].code,
    value: allCurrencies[key].code,
  }));

  const [open, setOpen] = useState(true);

  return (
    <>
      <div className="flex items-center justify-center py-4 bg-greenBg">
        <h1 className="text-white text-xl	font-light">Add Transaction</h1>
      </div>
      <form className="w-full px-5 py-10">
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Date
          </label>
          <div className="mt-0.5">
            <input
              required
              defaultValue={new Date().toISOString().split("T")[0]}
              type="date"
              name="date"
              id="date"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="mb-5">
          <label
            htmlFor="description"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Description
          </label>
          <div className="mt-0.5">
            <input
              required
              type="text"
              name="description"
              id="description"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Dinner at McDonald's"
            />
          </div>
        </div>

        <div className="mb-5">
          <label
            htmlFor="price"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Price
          </label>
          <div className="relative mt-0.5 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              required
              type="text"
              name="price"
              id="price"
              className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="0.00"
              aria-describedby="price-currency"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm" id="price-currency">
                SGD
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-5 inline-flex justify-center items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Submit
          <CheckCircleIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
        </button>
      </form>

      <FilterSelect
        isOpen={open}
        onClose={() => setOpen(false)}
        data={currencies}
      />
    </>
  );
};

export default AddTransaction;
