import React from "react";
import { useQuery } from "@tanstack/react-query";

import SkeletonLoader from "@frontend/src/components/skeleton-loader";

import { activities } from "./mock-data";

import {
  BanknotesIcon,
  Bars3CenterLeftIcon,
} from "@heroicons/react/24/outline";

type Activity = {
  id: string;
  from: string;
  to: string;
  date: string;
  amount: number;
};

const LoadingActivitiesSkeleton = () => {
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

interface ActivityProps {
  activity: Activity;
}

const Activity = ({ activity }: ActivityProps) => {
  const isPaid = activity.amount > 0;
  const textColor = isPaid ? "text-greenBg" : "text-redBg";
  const moneyText = isPaid
    ? `You were paid $${activity.amount}`
    : `You paid $${-activity.amount}`;
  return (
    <li className="col-span-1 flex rounded-md shadow-sm">
      <div className="flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm border">
        <BanknotesIcon className="h-7 w-7" aria-hidden="true" />
      </div>
      <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
        <div className="flex-1 truncate px-4 py-2 text-sm">
          <a className="font-medium text-gray-900 hover:text-gray-600">
            {activity.from} paid {activity.to}
          </a>
          <p className={`text-gray-500 ${textColor}`}>{moneyText}</p>
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

const fetchActivities = async () => {
  return new Promise<Activity[]>((resolve) => {
    setTimeout(() => resolve(activities as Activity[]), 1000);
  });
};

const ActivityTab = () => {
  const { data: activitiesData, isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: fetchActivities,
  });

  return (
    <>
      <div className="flex flex-col h-full gap-4 overflow-y-auto pb-4">
        <SkeletonLoader
          isLoading={isLoading}
          skeleton={<LoadingActivitiesSkeleton />}
        >
          {activitiesData?.map((activity) => (
            <Activity key={activity.id} activity={activity} />
          ))}
        </SkeletonLoader>
      </div>
    </>
  );
};

export default ActivityTab;
