import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import SkeletonLoader from "@frontend/src/components/skeleton-loader";
import Select from "@frontend/src/components/select";

import { groups } from "./mock-data";

import {
  HomeModernIcon,
  GlobeAsiaAustraliaIcon,
  HeartIcon,
  UserGroupIcon as UserGroupIconOutline,
  Bars3CenterLeftIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { UserGroupIcon as UserGroupIconSolid } from "@heroicons/react/16/solid";

enum GroupCategory {
  Trip = "Trip",
  Home = "Home",
  Couple = "Couple",
  Others = "Others",
}

const iconMap: Record<GroupCategory, React.ReactNode> = {
  [GroupCategory.Trip]: (
    <GlobeAsiaAustraliaIcon className="h-7 w-7" aria-hidden="true" />
  ),
  [GroupCategory.Home]: (
    <HomeModernIcon className="h-7 w-7" aria-hidden="true" />
  ),
  [GroupCategory.Couple]: <HeartIcon className="h-7 w-7" aria-hidden="true" />,
  [GroupCategory.Others]: (
    <UserGroupIconOutline className="h-7 w-7" aria-hidden="true" />
  ),
};

type Group = {
  id: string;
  name: string;
  category: GroupCategory;
  amount: number;
};

const LoadingGroupsSkeleton = () => {
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

interface GroupProps {
  group: Group;
}

const Group = ({ group }: GroupProps) => {
  const icon = iconMap[group.category];
  const isSettledUp = group.amount === 0;
  const isOwed = group.amount > 0;
  const textColor = isSettledUp
    ? "text-gray-500"
    : isOwed
    ? "text-greenBg"
    : "text-redBg";
  const money = isSettledUp
    ? "All settled up"
    : isOwed
    ? `You are owed $${group.amount}`
    : `You owe $${-group.amount}`;
  return (
    <li className="col-span-1 flex rounded-md shadow-sm">
      <div className="flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm border">
        {icon}
      </div>
      <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
        <div className="flex-1 truncate px-4 py-2 text-sm">
          <a className="font-medium text-gray-900 hover:text-gray-600">
            {group.name}
          </a>
          <p className={`text-gray-500 ${textColor}`}>{money}</p>
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

const fetchGroups = async () => {
  return new Promise<Group[]>((resolve) => {
    setTimeout(() => resolve(groups as Group[]), 1000);
  });
};

const filterOptions = [
  { label: "None", value: "none" },
  { label: "Groups with outstanding balances", value: "outstanding" },
  { label: "Groups you owe", value: "owe" },
  { label: "Groups who owe you", value: "owed" },
];

const GroupsTab = () => {
  const [selectedOption, setSelectedOption] = useState("none");
  const [showSelect, setShowSelect] = useState(false);
  const [search, setSearch] = useState("");

  const { data: groupsData, isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
  });

  const displayGroups = groupsData?.filter(
    (group) => group.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
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
              <UserGroupIconSolid
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Trip to Oslo, Norway"
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
          skeleton={<LoadingGroupsSkeleton />}
        >
          {displayGroups?.map((group) => (
            <Group key={group.id} group={group} />
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

export default GroupsTab;
