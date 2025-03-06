import React, { useState } from "react";
import NoSSR from "@frontend/src/components/no-ssr/NoSSR";
import { CheckCircleIcon } from "@heroicons/react/16/solid";
import FilterSelect, {
  FilterSelectOptionData,
} from "@frontend/src/components/filter-select";
import { allCurrencies } from "./currencies";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { useLocalStorage } from "usehooks-ts";

const currencies: FilterSelectOptionData<string>[] = Object.keys(
  allCurrencies
).map((key) => ({
  title: allCurrencies[key].name,
  subtitle: allCurrencies[key].code,
  value: allCurrencies[key].code,
}));

const AddTransaction = () => {
  const [currencyCode, setCurrencyCode, _] = useLocalStorage<string>(
    "currency",
    "SGD",
    {
      initializeWithValue: false,
    }
  );

  const selectedCurrency =
    currencies.find((c) => c.subtitle === currencyCode) || currencies[0];

  const [isCurrencyFilterOpen, setIsCurrencyFilterOpen] = useState(false);
  const setSelectedCurrency = (currencyCode: string) => {
    const currency = currencies.find((c) => c.value === currencyCode);
    if (currency) {
      setCurrencyCode(currency.value);
      setIsCurrencyFilterOpen(false);
    }
  };

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
          <div className="flex">
            <div className="-mr-px grid grow grid-cols-1 focus-within:relative">
              <input
                id="query"
                name="query"
                type="text"
                placeholder="0.00"
                className="col-start-1 row-start-1 pr-3 pl-10 block w-full rounded-l-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <BanknotesIcon
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 sm:size-4"
              />
            </div>
            <button
              onClick={() => setIsCurrencyFilterOpen(true)}
              type="button"
              className="flex border shrink-0 items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 outline-1 -outline-offset-1 outline-gray-300 hover:bg-gray-50 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
            >
              {selectedCurrency.subtitle}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-5 inline-flex justify-center items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Submit
        </button>
      </form>

      <FilterSelect
        isOpen={isCurrencyFilterOpen}
        onChange={setSelectedCurrency}
        onClose={() => setIsCurrencyFilterOpen(false)}
        data={currencies}
      />
    </>
  );
};

export default AddTransaction;
