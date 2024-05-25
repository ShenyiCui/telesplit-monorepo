import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import SkeletonLoader from "@frontend/src/components/skeleton-loader";
import Select from "@frontend/src/components/select";

import { Bars3CenterLeftIcon, UsersIcon } from "@heroicons/react/16/solid";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { friends } from "./mock-data";

type Friend = {
  id: string;
  name: string;
  amount: number;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const LoadingFriendsSkeleton = () => {
  const skeleton = Array.from(Array(5).keys()).map((i) => `skeleton-${i}`);
  return (
    <>
      {skeleton.map((s) => (
        <li
          key={s}
          className="col-span-1 flex rounded-md shadow-sm animate-pulse"
        >
          <div className="flex h-[58px] w-16 flex-shrink-0 items-center justify-center rounded-l-md text-white bg-slate-200" />
          <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
            <div className="flex-1 truncate px-4 py-2 text-sm">
              <div className="bg-slate-200 h-3 w-11 mb-2" />
              <div className="bg-slate-200 h-3 w-24" />
            </div>
            <div className="flex-shrink-0 pr-2">
              <div className="bg-slate-200 rounded-full h-6 w-6" />
            </div>
          </div>
        </li>
      ))}
    </>
  );
};

interface FriendProps {
  friend: Friend;
}

const Friend = ({ friend }: FriendProps) => {
  const isSettledUp = friend.amount === 0;
  const isOwed = friend.amount > 0;
  const bgColor = isSettledUp
    ? "bg-gray-500"
    : isOwed
    ? "bg-greenBg"
    : "bg-redBg";
  const money = isSettledUp
    ? "All settled up"
    : isOwed
    ? `You are owed $${friend.amount}`
    : `You owe $${-friend.amount}`;
  const initals = friend.name
    .split(" ")
    .map((n) => n[0])
    .join("");
  return (
    <li className="col-span-1 flex rounded-md shadow-sm">
      <div
        className={classNames(
          "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white",
          bgColor
        )}
      >
        {initals}
      </div>
      <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
        <div className="flex-1 truncate px-4 py-2 text-sm">
          <a className="font-medium text-gray-900 hover:text-gray-600">
            {friend.name}
          </a>
          <p className="text-gray-500">{money}</p>
        </div>
        <div className="flex-shrink-0 pr-2">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span className="sr-only">Open options</span>
            <Bars3CenterLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  );
};

const fetchFriendsData = () => {
  return new Promise<Friend[]>((resolve) => {
    setTimeout(() => {
      resolve(friends);
    }, 4000);
  });
};

const filterOptions = [
  { label: "None", value: "none" },
  { label: "Friends with outstanding balances", value: "outstanding" },
  { label: "Friends you owe", value: "owe" },
  { label: "Friends who owe you", value: "owed" },
];

const FriendsTab = () => {
  const [selectedOption, setSelectedOption] = useState("none");
  const [showSelect, setShowSelect] = useState(false);
  const [search, setSearch] = useState("");

  const { data: friendsData, isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: fetchFriendsData,
  });

  const displayFriends = friendsData?.filter(
    (friend) => friend.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
  );

  const handleSelectClick = () => {
    setShowSelect(true);
  };

  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
    setShowSelect(false);
  };

  const handleSelectCancel = () => {
    setShowSelect(false);
  };

  return (
    <>
      <div className="w-full bg-white">
        <div className="flex rounded-md shadow-sm">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <UsersIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Edsger W. Dijkstra"
            />
          </div>
          <button
            type="button"
            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={handleSelectClick}
          >
            <AdjustmentsHorizontalIcon
              className="-ml-0.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Filter
          </button>
        </div>
      </div>

      <div className="flex flex-col h-full gap-4 overflow-y-auto pb-4">
        <SkeletonLoader
          isLoading={isLoading}
          skeleton={<LoadingFriendsSkeleton />}
        >
          {displayFriends?.map((friend) => (
            <Friend key={friend.id} friend={friend} />
          ))}
        </SkeletonLoader>
      </div>

      {showSelect && (
        <Select
          options={filterOptions}
          value={selectedOption}
          onCancel={handleSelectCancel}
          onChange={handleSelectChange as (value: unknown) => void}
        />
      )}
    </>
  );
};

export default FriendsTab;
