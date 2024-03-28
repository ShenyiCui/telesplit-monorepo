import React from "react";

interface SkeletonLoaderProps {
  children: React.ReactNode;
  isLoading: boolean;
  skeleton: React.ReactNode;
}

const SkeletonLoader = ({
  children,
  isLoading,
  skeleton,
}: SkeletonLoaderProps) => (
  <>
    {isLoading && skeleton}
    {!isLoading && children}
  </>
);

export default SkeletonLoader;
