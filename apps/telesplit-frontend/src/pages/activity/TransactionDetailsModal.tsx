import React from "react";
import { format, parseISO } from "date-fns";
import Modal from "@frontend/src/components/modal";
import { XMarkIcon } from "@heroicons/react/20/solid";

export interface TransactionSplit {
  name: string;
  amount: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  involvement: "owed" | "owedToYou" | "notInvolved";
  paidBy: string;
  splits?: TransactionSplit[];
}

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onEdit,
  onDelete,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Transaction Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Description:</span>{" "}
            {transaction.description}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Date:</span>{" "}
            {format(parseISO(transaction.date), "dd MMM, yyyy")}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Total Amount:</span>{" "}
            {transaction.currency} {transaction.amount.toFixed(2)}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Paid by:</span> {transaction.paidBy}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Split Details
          </h3>
          {transaction.splits && transaction.splits.length > 0 ? (
            <ul className="space-y-1">
              {transaction.splits.map((split, idx) => (
                <li
                  key={idx}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span>{split.name}</span>
                  <span>
                    {transaction.currency} {split.amount.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500">Not split with anyone.</p>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onEdit(transaction)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(transaction.id)}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionDetailsModal;
