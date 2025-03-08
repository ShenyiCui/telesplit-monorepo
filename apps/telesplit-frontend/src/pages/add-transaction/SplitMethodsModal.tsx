import React, { useEffect, useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import {
  EqualsIcon,
  CalculatorIcon,
  PercentBadgeIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Modal from "@frontend/src/components/modal";

// Utility for applying conditional classes
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface Participant {
  name: string;
}

interface SplitMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount?: number;
  participants?: Participant[]; // default fallback provided
}

const SplitMethodModal: React.FC<SplitMethodModalProps> = ({
  isOpen,
  onClose,
  totalAmount = 0,
  participants = [],
}) => {
  // --- STATE FOR EACH TAB’S SPLIT DATA ---
  const [equallyChecked, setEquallyChecked] = useState<boolean[]>(
    participants.map(() => true)
  );
  const [exactAmounts, setExactAmounts] = useState<number[]>(
    participants.map(() => 0)
  );
  const [percentages, setPercentages] = useState<number[]>(
    participants.map(() => 0)
  );
  const [shares, setShares] = useState<number[]>(participants.map(() => 1));

  // --- SEARCH STATE for each tab ---
  const [searchEqually, setSearchEqually] = useState("");
  const [searchExact, setSearchExact] = useState("");
  const [searchPercent, setSearchPercent] = useState("");
  const [searchShares, setSearchShares] = useState("");

  // Reset state whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setEquallyChecked(participants.map(() => true));
      setExactAmounts(participants.map(() => 0));
      setPercentages(participants.map(() => 0));
      setShares(participants.map(() => 1));

      // Reset search fields as well
      setSearchEqually("");
      setSearchExact("");
      setSearchPercent("");
      setSearchShares("");
    }
  }, [participants, isOpen]);

  // --- EVENT HANDLERS ---
  const handleEqualCheckChange = (index: number, checked: boolean) => {
    const copy = [...equallyChecked];
    copy[index] = checked;
    setEquallyChecked(copy);
  };

  const handleExactChange = (index: number, value: number) => {
    const copy = [...exactAmounts];
    copy[index] = value;
    setExactAmounts(copy);
  };

  const handlePercentageChange = (index: number, value: number) => {
    const copy = [...percentages];
    copy[index] = value;
    setPercentages(copy);
  };

  const handleSharesChange = (index: number, value: number) => {
    const copy = [...shares];
    copy[index] = value < 0 ? 0 : value;
    setShares(copy);
  };

  // --- DERIVED DATA FOR EACH TAB ---
  const checkedCount = equallyChecked.filter(Boolean).length || 1;
  const totalExactValue = exactAmounts.reduce((a, b) => a + b, 0);
  const leftoverExact = totalAmount - totalExactValue;
  const totalPercent = percentages.reduce((a, b) => a + b, 0);
  const leftoverPercent = 100 - totalPercent;
  const totalShares = shares.reduce((a, b) => a + b, 0);

  // Create a helper to get filtered participants (preserving original index)
  const filterParticipants = (query: string) =>
    participants
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.name.toLowerCase().includes(query.toLowerCase()));

  // --- "Select All / Deselect All" for Equally Tab ---
  const filteredEqually = filterParticipants(searchEqually);
  const allFilteredSelected = filteredEqually.every(
    ({ i }) => equallyChecked[i]
  );
  const toggleSelectFiltered = () => {
    setEquallyChecked((prev) => {
      const copy = [...prev];
      filteredEqually.forEach(({ i }) => (copy[i] = !allFilteredSelected));
      return copy;
    });
  };

  const handleSaveAndClose = () => {
    // TODO: Add your custom logic for these splits.
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col max-h-[80vh] min-h-[80vh]">
        <TabGroup className="flex flex-col flex-1 min-h-0">
          <TabList className="mb-2 flex space-x-1 rounded-xl bg-gray-100 p-1">
            {["Split Equally", "Exact Amounts", "Percentage", "Shares"].map(
              (tabName, idx) => (
                <Tab
                  key={tabName}
                  className={({ selected }) =>
                    classNames(
                      "flex justify-center w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700",
                      "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-300 focus:outline-none focus:ring-2",
                      selected
                        ? "bg-white shadow"
                        : "text-gray-500 hover:bg-white/[0.8] hover:text-gray-600"
                    )
                  }
                >
                  {idx === 0 && <EqualsIcon className="h-6 w-6" />}
                  {idx === 1 && <CalculatorIcon className="h-6 w-6" />}
                  {idx === 2 && <PercentBadgeIcon className="h-6 w-6" />}
                  {idx === 3 && (
                    <AdjustmentsHorizontalIcon className="h-6 w-6" />
                  )}
                </Tab>
              )
            )}
          </TabList>

          <TabPanels className="flex-1 min-h-0 overflow-y-auto">
            {/* TAB 1: SPLIT EQUALLY */}
            <TabPanel className="flex flex-col flex-1 min-h-0 gap-y-2">
              <div className="sticky top-0 bg-white pb-2 flex flex-col gap-y-2">
                <p className="text-sm font-bold text-gray-600 text-center">
                  Split Equally
                </p>
                <p className="text-sm text-gray-700">
                  Total Amount: <strong>${totalAmount.toFixed(2)}</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Check who is included in splitting this total equally. The
                  cost for each checked participant is:
                </p>
                {/* Select All / Deselect All */}
                <button
                  onClick={toggleSelectFiltered}
                  className="self-end text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  {allFilteredSelected ? "Deselect All" : "Select All"}
                </button>
                {/* Search Filter */}
                <input
                  type="text"
                  placeholder="Search participants..."
                  value={searchEqually}
                  onChange={(e) => setSearchEqually(e.target.value)}
                  className="block w-full rounded-md border-gray-300 px-3 py-1.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex-1 min-h-0">
                {filterParticipants(searchEqually).map(({ p, i }) => {
                  const share = equallyChecked[i]
                    ? totalAmount / (checkedCount || 1)
                    : 0;
                  return (
                    <li
                      key={p.name + i}
                      className="flex rounded-md shadow-sm mb-2 cursor-pointer"
                      onClick={() =>
                        handleEqualCheckChange(i, !equallyChecked[i])
                      }
                    >
                      <div className="flex flex-1 items-center justify-between truncate rounded-md border border-gray-200 bg-white">
                        <div className="flex-1 truncate px-4 py-2 text-sm">
                          <span className="font-medium text-gray-900 hover:text-gray-600">
                            {p.name}
                          </span>
                        </div>
                        <div className="flex pr-4 items-center space-x-3">
                          <span className="text-gray-600 text-sm">
                            ${share.toFixed(2)}
                          </span>
                          <input
                            id={`equal-${i}`}
                            type="checkbox"
                            checked={equallyChecked[i]}
                            onChange={() => {}}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </div>
            </TabPanel>

            {/* TAB 2: SPLIT EXACT AMOUNTS */}
            <TabPanel className="flex flex-col flex-1 min-h-0 gap-y-2">
              <div className="sticky top-0 bg-white pb-2 flex flex-col gap-y-2">
                <p className="text-sm font-bold text-gray-600 text-center">
                  Exact Amounts
                </p>
                <p
                  className={classNames(
                    "text-sm",
                    leftoverExact < 0 ? "text-red-500" : "text-gray-700"
                  )}
                >
                  Remaining: <strong>${leftoverExact.toFixed(2)}</strong>
                </p>
                <p className="text-sm text-gray-700">
                  Enter exactly how much each participant will pay.
                </p>
                <input
                  type="text"
                  placeholder="Search participants..."
                  value={searchExact}
                  onChange={(e) => setSearchExact(e.target.value)}
                  className="block w-full rounded-md border-gray-300 px-3 py-1.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex-1 min-h-0">
                {filterParticipants(searchExact).map(({ p, i }) => (
                  <li
                    key={p.name + i}
                    className="flex rounded-md shadow-sm mb-2"
                  >
                    <div className="flex flex-1 items-center justify-between rounded-md border border-gray-200 bg-white">
                      <div className="flex-1 truncate px-4 py-2 text-sm">
                        <span className="font-medium text-gray-900 hover:text-gray-600">
                          {p.name}
                        </span>
                      </div>
                      <div className="flex pr-2 items-center">
                        <input
                          id={`exact-${i}`}
                          type="number"
                          inputMode="numeric"
                          step="0.01"
                          placeholder="0.00"
                          value={exactAmounts[i]}
                          onChange={(e) =>
                            handleExactChange(i, parseFloat(e.target.value))
                          }
                          onFocus={() => {
                            if (exactAmounts[i] === 0) {
                              handleExactChange(i, NaN);
                            }
                          }}
                          className="my-1.5 py-1.5 w-28 rounded-md border-gray-300 text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-right"
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </div>
            </TabPanel>

            {/* TAB 3: SPLIT BY PERCENTAGE */}
            <TabPanel className="flex flex-col flex-1 min-h-0 gap-y-2">
              <div className="sticky top-0 bg-white pb-2 flex flex-col gap-y-2">
                <p className="text-sm font-bold text-gray-600 text-center">
                  Percentages
                </p>
                <p
                  className={classNames(
                    "text-sm",
                    leftoverPercent < 0 ? "text-red-500" : "text-gray-700"
                  )}
                >
                  Remaining: <strong>{leftoverPercent.toFixed(2)}%</strong>
                </p>
                <p className="text-sm text-gray-700">
                  Each participant’s share of 100%. Enter a percentage for each
                  person to see how much they pay in currency.
                </p>
                <input
                  type="text"
                  placeholder="Search participants..."
                  value={searchPercent}
                  onChange={(e) => setSearchPercent(e.target.value)}
                  className="block w-full rounded-md border-gray-300 px-3 py-1.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex-1 min-h-0">
                {filterParticipants(searchPercent).map(({ p, i }) => {
                  const percentVal = percentages[i];
                  const amountVal = (totalAmount * percentVal) / 100;
                  return (
                    <li
                      key={p.name + i}
                      className="flex rounded-md shadow-sm mb-2"
                    >
                      <div className="flex flex-1 items-center justify-between rounded-md border border-gray-200 bg-white">
                        <div className="flex-1 truncate px-4 py-2 text-sm">
                          <span className="font-medium text-gray-900 hover:text-gray-600">
                            {p.name}
                          </span>
                        </div>
                        <div className="flex pr-3 items-center space-x-3">
                          <span className="text-gray-600 text-sm">
                            ${amountVal.toFixed(2)}
                          </span>
                          <div className="flex items-center space-x-1">
                            <input
                              id={`percent-${i}`}
                              type="number"
                              step="0.01"
                              inputMode="numeric"
                              placeholder="0"
                              value={percentVal}
                              onChange={(e) =>
                                handlePercentageChange(
                                  i,
                                  parseFloat(e.target.value)
                                )
                              }
                              onFocus={() => {
                                if (percentages[i] === 0) {
                                  handlePercentageChange(i, NaN);
                                }
                              }}
                              className="my-1.5 w-20 rounded-md border-gray-300 py-1.5 text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-right"
                            />
                            <span className="text-sm text-gray-600">%</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </div>
            </TabPanel>

            {/* TAB 4: SPLIT BY SHARES */}
            <TabPanel className="flex flex-col flex-1 min-h-0 gap-y-2">
              <div className="sticky top-0 bg-white pb-2 flex flex-col gap-y-2">
                <p className="text-sm font-bold text-gray-600 text-center">
                  Shares
                </p>
                <p className="text-sm text-gray-700">
                  Total shares used: <strong>{totalShares}</strong>
                </p>
                <p className="text-sm text-gray-700">
                  Each participant’s number of “shares.” The cost is split by
                  each person’s ratio of the total shares.
                </p>
                <input
                  type="text"
                  placeholder="Search participants..."
                  value={searchShares}
                  onChange={(e) => setSearchShares(e.target.value)}
                  className="block w-full rounded-md border-gray-300 px-3 py-1.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex-1 min-h-0">
                {filterParticipants(searchShares).map(({ p, i }) => {
                  const userShares = shares[i];
                  const shareCost =
                    totalShares === 0
                      ? 0
                      : (totalAmount * userShares) / totalShares;
                  return (
                    <li
                      key={p.name + i}
                      className="flex rounded-md shadow-sm mb-2"
                    >
                      <div className="flex flex-1 items-center justify-between rounded-md border border-gray-200 bg-white">
                        <div className="flex-1 truncate px-4 py-2 text-sm">
                          <span className="font-medium text-gray-900 hover:text-gray-600">
                            {p.name}
                          </span>
                        </div>
                        <div className="flex items-center pr-3 space-x-3">
                          <span className="text-gray-600 text-sm">
                            ${shareCost.toFixed(2)}
                          </span>
                          <input
                            id={`share-${i}`}
                            type="number"
                            step="1"
                            inputMode="numeric"
                            placeholder="0"
                            value={userShares}
                            onChange={(e) =>
                              handleSharesChange(i, parseFloat(e.target.value))
                            }
                            onFocus={() => {
                              if (shares[i] === 1) {
                                handleSharesChange(i, NaN);
                              }
                            }}
                            className="my-1.5 w-20 rounded-md border-gray-300 py-1.5 text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-right"
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>

        {/* Footer Buttons */}
        <div className="mt-4 flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAndClose}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit <CheckCircleIcon className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SplitMethodModal;
