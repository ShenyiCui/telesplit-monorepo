import React, { useState } from "react";
import FilterSelect, {
  FilterSelectOptionData,
} from "@frontend/src/components/filter-select";
import MultiSelect from "@frontend/src/components/multi-select";
import { allCurrencies } from "../../../constants/currencies";
import { BanknotesIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useLocalStorage } from "usehooks-ts";
import SplitMethodModal from "@frontend/src/components/split-methods-modal";
import ToastContainer, {
  ToastData,
} from "@frontend/src/components/toast-container";

const currencies: FilterSelectOptionData<string>[] = Object.keys(
  allCurrencies
).map((key) => ({
  title: allCurrencies[key].name,
  subtitle: allCurrencies[key].code,
  value: allCurrencies[key].code,
}));

const AddTransaction = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (toast: Omit<ToastData, "id">) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const [isCurrencyFilterOpen, setIsCurrencyFilterOpen] = useState(false);
  const [currencyCode, setCurrencyCode] = useLocalStorage<string>(
    "currency",
    "SGD",
    { initializeWithValue: false }
  );
  const selectedCurrency =
    currencies.find((c) => c.subtitle === currencyCode) || currencies[0];

  const setSelectedCurrency = (code: string) => {
    const currency = currencies.find((c) => c.value === code);
    if (currency) {
      setCurrencyCode(currency.value);
      setIsCurrencyFilterOpen(false);
    }
  };

  // Example participants. In real usage, you might replace or fetch them.
  const [selectedPartipants, setSelectedParticipants] = useState<string[]>([]);
  const participants = [
    { name: "You" },
    ...selectedPartipants.map((n) => ({ name: n })),
  ];

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // For demonstrating the SplitMethodModal
  const [isSplitMethodModalOpen, setIsSplitMethodModalOpen] = useState(false);

  const [isPayeeFilterOpen, setIsPayeeFilterOpen] = useState(false);
  const [payee, setPayee] = useState(participants[0].name);
  const allPayees = [...participants.map((p) => p.name)].map((p) => ({
    title: p,
    subtitle: "",
    value: p,
  }));
  const setSelectedPayee = (payee: string) => {
    setPayee(payee);
    setIsPayeeFilterOpen(false);
  };

  const openSplitMethodModal = () => {
    if (participants.length < 2) {
      addToast({
        type: "error",
        message: "You need at least one other person to split with",
      });
      return;
    }

    if (parseFloat(price) <= 0) {
      addToast({
        type: "error",
        message: "Please enter a valid price",
      });
      return;
    }

    if (parseFloat(price) === 0 || isNaN(parseFloat(price))) {
      addToast({
        type: "error",
        message: "Price cannot be zero",
      });
      return;
    }

    if (description === "") {
      addToast({
        type: "error",
        message: "Please enter a description",
      });
      return;
    }

    setIsSplitMethodModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-center py-4 bg-greenBg">
        <h1 className="text-white text-xl font-light">Edit Transaction</h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          // Handle form submission here
        }}
        className="w-full px-5 py-10"
      >
        <div className="mb-5">
          <label
            htmlFor="split-with"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Split with you and
          </label>
          <MultiSelect
            options={[
              "Pound Town",
              "Alice",
              "Bob",
              "Charlie",
              "David",
              "Eve",
              "Frank",
              "Grace",
              "Hannah",
            ]}
            selectedItems={selectedPartipants}
            onChange={setSelectedParticipants}
            placeholder="Search friends or groups"
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="date"
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                id="price"
                name="price"
                type="number"
                inputMode="numeric"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
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
              className="flex shrink-0 items-center gap-x-1.5 rounded-r-md border px-3 py-2 text-sm font-semibold text-gray-900 outline-1 -outline-offset-1 outline-gray-300 hover:bg-gray-50 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
            >
              {selectedCurrency.subtitle}
            </button>
          </div>
        </div>

        {/** Launch the new SplitMethodModal by clicking this “Equally” button */}
        <div className="flex justify-center gap-x-2">
          Paid by{" "}
          <button
            onClick={() => setIsPayeeFilterOpen(true)}
            type="button"
            className="rounded-sm bg-white px-2 py-1 text-xs font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
          >
            {payee}
          </button>
          split{" "}
          <button
            type="button"
            className="rounded-sm bg-white px-2 py-1 text-xs font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
            onClick={openSplitMethodModal}
          >
            Equally
          </button>
        </div>

        <button
          type="submit"
          className="mt-5 inline-flex w-full items-center justify-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <div className="flex items-center">
            Submit <CheckCircleIcon className="h-4 w-4 ml-1" />
          </div>
        </button>
      </form>

      <SplitMethodModal
        isOpen={isSplitMethodModalOpen}
        onClose={() => setIsSplitMethodModalOpen(false)}
        totalAmount={parseFloat(price) || 0}
        participants={participants}
      />

      <FilterSelect
        isOpen={isCurrencyFilterOpen}
        onChange={setSelectedCurrency}
        onClose={() => setIsCurrencyFilterOpen(false)}
        data={currencies}
      />

      <FilterSelect
        isOpen={isPayeeFilterOpen}
        onChange={setSelectedPayee}
        onClose={() => setIsPayeeFilterOpen(false)}
        data={allPayees}
      />

      <ToastContainer position="top" toasts={toasts} onDismiss={removeToast} />
    </>
  );
};

export default AddTransaction;
