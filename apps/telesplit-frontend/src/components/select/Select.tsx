import React, { forwardRef } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";

interface SelectProps<T> {
  options: { label: string; value: T }[];
  onChange?: (value: T) => void;
  onCancel?: () => void;
  value?: T;
}

const Select = forwardRef(function Select<T>(
  { options, value, onChange, onCancel }: SelectProps<T>,
  ref: React.Ref<HTMLDivElement>
) {
  const handleCancel = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onCancel?.();
  };

  const handleOnChange = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    value: T
  ) => {
    e.stopPropagation();
    onChange?.(value);
  };

  return (
    <>
      <div
        aria-live="assertive"
        className={`fixed inset-0 flex items-end px-4 py-6 bg-[#00000099]`}
        onClick={handleCancel}
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          <Transition
            show={true}
            as={React.Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div ref={ref} className="w-full flex flex-col gap-3">
              <div className="flex flex-col">
                {options.map((option, i) => (
                  <div
                    key={option.label}
                    onClick={() => onChange?.(option.value)}
                    className={`cursor-pointer w-full overflow-hidden bg-white shadow-lg ring-1 ring-black ring-opacity-5
                      ${i === 0 ? "rounded-t-lg" : ""}
                      ${i === options.length - 1 ? "rounded-b-lg" : ""}`}
                  >
                    <div className="p-4">
                      <div className="relative flex items-center">
                        <div className="ml-3 w-0 flex-1 pt-0.5">
                          <p className="text-sm font-medium text-blue-600 text-center">
                            {option.label}
                          </p>
                        </div>

                        {option.value === value && (
                          <CheckIcon className="h-6 w-6 absolute right-0" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div
                onClick={handleCancel}
                className="cursor-pointer w-full overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                      <p className="text-sm font-medium text-blue-600 text-center">
                        Cancel
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
});

export default Select;
