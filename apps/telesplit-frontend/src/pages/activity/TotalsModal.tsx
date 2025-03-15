import React, { useState, useEffect } from "react";
import Modal from "@frontend/src/components/modal";

export interface TotalsDataItem {
  name: string;
  amount: number;
  currency: string;
}

interface TotalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  owe: TotalsDataItem[]; // Parties you owe money to
  owedToYou: TotalsDataItem[]; // Parties that owe you money
  onSettleUp: () => void; // Callback to open Settle-Up modal
}

// Simple skeleton for the modal content
const ModalSkeleton = () => (
  <div className="animate-pulse p-4">
    <div className="h-6 bg-gray-300 rounded w-1/2 mb-4" />
    <div className="space-y-2">
      <div className="h-4 bg-gray-300 rounded" />
      <div className="h-4 bg-gray-300 rounded" />
      <div className="h-4 bg-gray-300 rounded" />
    </div>
  </div>
);

const TotalsModal: React.FC<TotalsModalProps> = ({
  isOpen = false,
  onClose,
  owe,
  owedToYou,
  onSettleUp,
}) => {
  const [loading, setLoading] = useState(true);
  // Simulate a short loading delay when the modal opens
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {loading ? (
        <ModalSkeleton />
      ) : (
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Settlement Summary
          </h2>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-red-600">You Owe</h3>
            {owe.length === 0 ? (
              <p className="text-xs text-gray-500">Nothing to settle.</p>
            ) : (
              <ul className="space-y-2 mt-2">
                {owe.map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span className="text-sm">{item.name}</span>
                    <span className="text-sm font-semibold text-red-600">
                      {item.currency} {item.amount.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-green-600">You Are Owed</h3>
            {owedToYou.length === 0 ? (
              <p className="text-xs text-gray-500">Nothing to settle.</p>
            ) : (
              <ul className="space-y-2 mt-2">
                {owedToYou.map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span className="text-sm">{item.name}</span>
                    <span className="text-sm font-semibold text-green-600">
                      {item.currency} {item.amount.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={onSettleUp}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Settle-Up
          </button>
        </div>
      )}
    </Modal>
  );
};

export default TotalsModal;
