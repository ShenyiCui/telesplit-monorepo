import React, { useState, useEffect } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/20/solid";
import Modal from "@frontend/src/components/modal";

export interface SettlementOption {
  name: string;
  defaultAmount: number;
  currency: string;
}

interface SettleUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  youOweOptions: SettlementOption[];
  youAreOwedOptions: SettlementOption[];
  onSave: (settlements: {
    youOwe?: { option: SettlementOption; amount: number };
    youAreOwed?: { option: SettlementOption; amount: number };
  }) => void;
}

const SettleUpModal: React.FC<SettleUpModalProps> = ({
  isOpen = false,
  onClose,
  youOweOptions = [],
  youAreOwedOptions = [],
  onSave,
}) => {
  const [selectedOwe, setSelectedOwe] = useState<SettlementOption | null>(null);
  const [oweAmount, setOweAmount] = useState<number>(0);
  const [selectedOwed, setSelectedOwed] = useState<SettlementOption | null>(
    null
  );
  const [owedAmount, setOwedAmount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"owe" | "owed">("owe");

  const handleSave = () => {
    if (activeTab === "owe" && selectedOwe) {
      onSave({ youOwe: { option: selectedOwe, amount: oweAmount } });
    } else if (activeTab === "owed" && selectedOwed) {
      onSave({ youAreOwed: { option: selectedOwed, amount: owedAmount } });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Settle-Up</h2>
        <TabGroup
          onChange={(index) => setActiveTab(index === 0 ? "owe" : "owed")}
        >
          <TabList className="flex space-x-2">
            <Tab
              className={({ selected }) =>
                `px-4 py-2 rounded text-sm font-medium ${
                  selected
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`
              }
            >
              I Owe
            </Tab>
            <Tab
              className={({ selected }) =>
                `px-4 py-2 rounded text-sm font-medium ${
                  selected
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`
              }
            >
              I’m Owed
            </Tab>
          </TabList>
          <TabPanels className="mt-2">
            <TabPanel className="space-y-2">
              {/* Header for I Owe */}
              <div className="flex items-center gap-2">
                <XCircleIcon className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-600">
                  Settle What You Owe
                </span>
              </div>
              {youOweOptions.length > 0 ? (
                <>
                  <select
                    className="w-full rounded-md border border-red-300 px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500"
                    value={selectedOwe?.name || ""}
                    onChange={(e) => {
                      const option =
                        youOweOptions.find((o) => o.name === e.target.value) ||
                        null;
                      setSelectedOwe(option);
                      setOweAmount(option ? option.defaultAmount : 0);
                    }}
                  >
                    <option value="">Select</option>
                    {youOweOptions.map((opt, idx) => (
                      <option key={idx} value={opt.name}>
                        {opt.name} ({opt.currency}{" "}
                        {opt.defaultAmount.toFixed(2)})
                      </option>
                    ))}
                  </select>
                  {selectedOwe && (
                    <input
                      type="number"
                      value={oweAmount}
                      onChange={(e) => setOweAmount(parseFloat(e.target.value))}
                      className="mt-1 w-full rounded-md border border-red-300 px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500"
                    />
                  )}
                </>
              ) : (
                <p className="text-xs text-gray-500">Nothing to settle.</p>
              )}
            </TabPanel>
            <TabPanel className="space-y-2">
              {/* Header for I'm Owed */}
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  Settle What You&apos;re Owed
                </span>
              </div>
              {youAreOwedOptions.length > 0 ? (
                <>
                  <select
                    className="w-full rounded-md border border-green-300 px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500"
                    value={selectedOwed?.name || ""}
                    onChange={(e) => {
                      const option =
                        youAreOwedOptions.find(
                          (o) => o.name === e.target.value
                        ) || null;
                      setSelectedOwed(option);
                      setOwedAmount(option ? option.defaultAmount : 0);
                    }}
                  >
                    <option value="">Select</option>
                    {youAreOwedOptions.map((opt, idx) => (
                      <option key={idx} value={opt.name}>
                        {opt.name} ({opt.currency}{" "}
                        {opt.defaultAmount.toFixed(2)})
                      </option>
                    ))}
                  </select>
                  {selectedOwed && (
                    <input
                      type="number"
                      value={owedAmount}
                      onChange={(e) =>
                        setOwedAmount(parseFloat(e.target.value))
                      }
                      className="mt-1 w-full rounded-md border border-green-300 px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500"
                    />
                  )}
                </>
              ) : (
                <p className="text-xs text-gray-500">Nothing to settle.</p>
              )}
            </TabPanel>
          </TabPanels>
        </TabGroup>
        <button
          onClick={handleSave}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Save Settlement
        </button>
      </div>
    </Modal>
  );
};

export default SettleUpModal;
