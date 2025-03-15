import React, { useEffect, useState } from "react";
import { format, parseISO, compareDesc } from "date-fns";
import TotalsModal, { TotalsDataItem } from "./TotalsModal";
import SettleUpModal, { SettlementOption } from "./SettleUpModal";
import TransactionDetailsModal, {
  Transaction,
} from "./TransactionDetailsModal";
import {
  groupInfo,
  dummyTransactions,
} from "@frontend/constants/activity-mock-data";

// Helper: Group transactions by month and year
const groupTransactions = (txs: Transaction[]) => {
  const groups: Record<string, Transaction[]> = {};
  txs.forEach((tx) => {
    const key = format(parseISO(tx.date), "MMMM yyyy");
    if (!groups[key]) groups[key] = [];
    groups[key].push(tx);
  });
  return groups;
};

const ActivityPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(
    (dummyTransactions || []) as Transaction[]
  );
  const [isTotalsModalOpen, setIsTotalsModalOpen] = useState(false);
  const [isSettleUpModalOpen, setIsSettleUpModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate totals by currency for amounts you owe and are owed
  const totalOweByCurrency = transactions
    .filter((tx) => tx.involvement === "owed")
    .reduce((acc, tx) => {
      acc[tx.currency] = (acc[tx.currency] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

  const totalOwedToYouByCurrency = transactions
    .filter((tx) => tx.involvement === "owedToYou")
    .reduce((acc, tx) => {
      acc[tx.currency] = (acc[tx.currency] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

  // Build breakdown arrays (TotalsDataItem) for the TotalsModal
  const oweBreakdown: TotalsDataItem[] = [];
  const owedToYouBreakdown: TotalsDataItem[] = [];
  transactions.forEach((tx) => {
    if (tx.involvement === "owed") {
      const existing = oweBreakdown.find((item) => item.name === tx.paidBy);
      if (existing) {
        existing.amount += tx.amount;
      } else {
        oweBreakdown.push({
          name: tx.paidBy,
          amount: tx.amount,
          currency: tx.currency,
        });
      }
    }
    if (tx.involvement === "owedToYou") {
      const creditor = "Unknown";
      const existing = owedToYouBreakdown.find(
        (item) => item.name === creditor
      );
      if (existing) {
        existing.amount += tx.amount;
      } else {
        owedToYouBreakdown.push({
          name: creditor,
          amount: tx.amount,
          currency: tx.currency,
        });
      }
    }
  });

  // Convert breakdowns to SettlementOption arrays
  const youOweOptions = oweBreakdown
    .filter((item) => item.amount > 0)
    .map((item) => ({
      name: item.name,
      defaultAmount: item.amount,
      currency: item.currency,
    }));
  const youAreOwedOptions = owedToYouBreakdown
    .filter((item) => item.amount > 0)
    .map((item) => ({
      name: item.name,
      defaultAmount: item.amount,
      currency: item.currency,
    }));

  // Group transactions by month/year in descending order
  const grouped = groupTransactions(transactions);
  const sortedGroupKeys = Object.keys(grouped).sort((a, b) => {
    const dateA = parseISO(`01 ${a}`);
    const dateB = parseISO(`01 ${b}`);
    return compareDesc(dateA, dateB);
  });

  // Settlement save handler
  const handleSettlementSave = (settlements: {
    youOwe?: { option: SettlementOption; amount: number };
    youAreOwed?: { option: SettlementOption; amount: number };
  }) => {
    const now = new Date().toISOString();
    const newTxs: Transaction[] = [];
    if (settlements.youOwe) {
      newTxs.push({
        id: Date.now().toString() + "-owe",
        date: now,
        description: `Settlement: You paid ${settlements.youOwe.option.name}`,
        amount: settlements.youOwe.amount,
        currency: settlements.youOwe.option.currency,
        involvement: "owed",
        paidBy: settlements.youOwe.option.name,
      });
    }
    if (settlements.youAreOwed) {
      newTxs.push({
        id: Date.now().toString() + "-owed",
        date: now,
        description: `Settlement: ${settlements.youAreOwed.option.name} paid you`,
        amount: settlements.youAreOwed.amount,
        currency: settlements.youAreOwed.option.currency,
        involvement: "owedToYou",
        paidBy: "You",
      });
    }
    setTransactions((prev) => [...prev, ...newTxs]);
  };

  return (
    <>
      <div className="flex flex-col bg-white px-4 py-4 h-screen">
        {/* Group Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-full bg-greenBg flex items-center justify-center">
            <span className="text-white text-3xl">
              {groupInfo.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div>
            <h2 className="text-gray-900 text-xl font-semibold">
              {groupInfo.name}
            </h2>
            <p className="text-gray-500 text-sm">{groupInfo.type}</p>
          </div>
        </div>

        {/* Totals Section */}
        <div
          className="mb-4 p-4 rounded-md border border-gray-200 cursor-pointer"
          onClick={() => setIsTotalsModalOpen(true)}
        >
          <div className="flex flex-col sm:flex-row justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">
                You Owe:{" "}
                {Object.entries(totalOweByCurrency).map(([cur, amt], idx) => (
                  <span key={cur}>
                    {cur} {amt.toFixed(2)}
                    {idx < Object.keys(totalOweByCurrency).length - 1 && " || "}
                  </span>
                ))}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-green-600">
                You Are Owed:{" "}
                {Object.entries(totalOwedToYouByCurrency).map(
                  ([cur, amt], idx) => (
                    <span key={cur}>
                      {cur} {amt.toFixed(2)}
                      {idx < Object.keys(totalOwedToYouByCurrency).length - 1 &&
                        " || "}
                    </span>
                  )
                )}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Tap for details</p>
        </div>

        {/* Scrollable Activity Feed */}
        <div className="space-y-6 overflow-y-auto">
          {sortedGroupKeys.map((groupKey) => (
            <div key={groupKey}>
              <div className="mb-2">
                <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded">
                  {groupKey}
                </span>
              </div>
              <div className="space-y-4">
                {grouped[groupKey]
                  .sort((a, b) =>
                    compareDesc(parseISO(a.date), parseISO(b.date))
                  )
                  .map((tx) => (
                    <div
                      key={tx.id}
                      className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow-sm cursor-pointer"
                      onClick={() => {
                        setSelectedTransaction(tx);
                        setIsTransactionModalOpen(true);
                      }}
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {tx.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(parseISO(tx.date), "dd MMM, yyyy")}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {tx.involvement === "notInvolved"
                            ? "Not Involved"
                            : tx.paidBy + " paid"}
                        </p>
                      </div>
                      <div>
                        {tx.involvement === "owed" ? (
                          <p className="text-sm font-semibold text-red-600">
                            -{tx.currency} {tx.amount.toFixed(2)}
                          </p>
                        ) : tx.involvement === "owedToYou" ? (
                          <p className="text-sm font-semibold text-green-600">
                            +{tx.currency} {tx.amount.toFixed(2)}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">--</p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals Modal */}
      <TotalsModal
        isOpen={isTotalsModalOpen}
        onClose={() => setIsTotalsModalOpen(false)}
        owe={oweBreakdown}
        owedToYou={owedToYouBreakdown}
        onSettleUp={() => {
          setIsTotalsModalOpen(false);
          setIsSettleUpModalOpen(true);
        }}
      />

      {/* Settle-Up Modal */}
      <SettleUpModal
        isOpen={isSettleUpModalOpen}
        onClose={() => setIsSettleUpModalOpen(false)}
        youOweOptions={youOweOptions}
        youAreOwedOptions={youAreOwedOptions}
        onSave={handleSettlementSave}
      />

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <TransactionDetailsModal
          isOpen={isTransactionModalOpen}
          onClose={() => setIsTransactionModalOpen(false)}
          transaction={selectedTransaction}
          onEdit={(tx) => {
            // Handle editing logic here (e.g., open an edit modal)
            console.log("Edit transaction:", tx);
          }}
          onDelete={(id) => {
            setTransactions((prev) => prev.filter((t) => t.id !== id));
            setIsTransactionModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default ActivityPage;
