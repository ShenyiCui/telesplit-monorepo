import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import FriendsTab from "@frontend/src/components/friends-tab";
import GroupsTab from "@frontend/src/components/groups-tab";
import SkeletonLoader from "@frontend/src/components/skeleton-loader";
import ActivityTab from "../components/activity-tab";

const tabs = [{ name: "FRIENDS" }, { name: "GROUPS" }, { name: "ACTIVITY" }];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const LoadingMoneySkeleton = () => (
  <div className="bg-slate-200 h-7 w-full animate-pulse" />
);

const LoadingUserProfileSkeleton = () => (
  <>
    <div className="bg-slate-200 h-16 w-16 rounded-full animate-pulse" />
    <div className="bg-slate-200 h-4 w-16 animate-pulse" />
  </>
);

interface User {
  name: string;
  youOwe: number;
  youAreOwed: number;
}

const userObject = {
  name: "Shenyi Cui",
  youOwe: 50,
  youAreOwed: 1000,
} as User;

const fetchUser = () => {
  return new Promise<User>((resolve) => {
    setTimeout(() => {
      resolve(userObject);
    }, 2500);
  });
};

const Home = () => {
  const [currentTab, setCurrentTab] = useState("FRIENDS");
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  const handleTabChange = (tabName: string) => {
    setCurrentTab(tabName);
  };

  return (
    <div className="h-screen flex flex-col justify-between bg-greenBg">
      <div>
        <div className="flex items-center justify-center py-4">
          <h1 className="text-white text-xl	font-light">TELESPLIT</h1>
        </div>

        <div className="flex flex-col items-center px-5">
          <div className="flex flex-col items-center gap-2">
            <SkeletonLoader
              isLoading={isLoading}
              skeleton={<LoadingUserProfileSkeleton />}
            >
              <div className="flex justify-center items-center h-16 w-16 rounded-full bg-white">
                <span className="text-[#4CBB9B] text-3xl">
                  {user?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <span className="text-white text-xs">{user?.name}</span>
            </SkeletonLoader>
          </div>

          <div className="flex w-full py-2 bg-white rounded-md mt-4">
            <div className="w-full border-r-2 flex justify-center">
              <div className="flex flex-col flex-1 w-full items-center px-8">
                <div className="truncate text-sm font-medium text-gray-500">
                  You Owe
                </div>
                <div className="mt-1 text-xl w-full font-semibold tracking-tight text-gray-900 flex justify-center">
                  <SkeletonLoader
                    isLoading={isLoading}
                    skeleton={<LoadingMoneySkeleton />}
                  >
                    ${user?.youOwe?.toFixed(2)}
                  </SkeletonLoader>
                </div>
              </div>
            </div>

            <div className="w-full flex justify-center">
              <div className="flex flex-col flex-1 w-full items-center px-8">
                <div className="truncate text-sm font-medium text-gray-500">
                  You Are Owed
                </div>
                <div className="mt-1 text-xl w-full font-semibold tracking-tight text-gray-900 flex justify-center">
                  <SkeletonLoader
                    isLoading={isLoading}
                    skeleton={<LoadingMoneySkeleton />}
                  >
                    ${user?.youAreOwed?.toFixed(2)}
                  </SkeletonLoader>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-full mt-5 w-full bg-white rounded-t-3xl px-4 flex flex-col gap-4 overflow-y-hidden">
        <nav className="-mb-px flex justify-evenly" aria-label="Tabs">
          {tabs.map((tab) => (
            <a
              key={tab.name}
              onClick={() => handleTabChange(tab.name)}
              className={classNames(
                tab.name === currentTab
                  ? "border-greenBg text-greenBg"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                "whitespace-nowrap border-b-2 pt-4 pb-1 px-1 text-sm font-medium cursor-pointer"
              )}
              aria-current={tab.name === currentTab ? "page" : undefined}
            >
              {tab.name}
            </a>
          ))}
        </nav>

        {currentTab === "FRIENDS" && <FriendsTab />}
        {currentTab === "GROUPS" && <GroupsTab />}
        {currentTab === "ACTIVITY" && <ActivityTab />}
      </div>
    </div>
  );
};

export default Home;
