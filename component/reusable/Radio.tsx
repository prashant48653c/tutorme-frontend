"use client";

import React from "react";

export type RadioOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type RadioProps = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options?: RadioOption[];
  className?: string;
};

const defaultOptions: RadioOption[] = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

const Radio: React.FC<RadioProps> = ({
  name,
  value,
  onChange,
  options = defaultOptions,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center gap-6 ${className}`}
      role="radiogroup"
      aria-label={name}
    >
      {options.map((option) => {
        const isChecked = option.value === value;
        const isDisabled = Boolean(option.disabled);

        return (
          <label
            key={option.value}
            className={`group flex cursor-pointer items-center gap-2 select-none text-sm font-medium ${
              isDisabled ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isChecked}
              disabled={isDisabled}
              onChange={() => !isDisabled && onChange(option.value)}
              className="sr-only"
            />
            <span
              className={`relative flex h-5 w-5 items-center justify-center rounded-full transition-all duration-200 ${
                isChecked
                  ? "border-2 border-teal-500 shadow-[0_0_0_2px_rgba(20,184,166,0.35)]"
                  : "border-2 border-gray-300 bg-white"
              } ${!isDisabled ? "group-hover:border-gray-800" : ""}`}
            >
              <span
                className={`block h-2.5 w-2.5 rounded-full transition-all duration-200 ${
                  isChecked ? "bg-gray-900" : "bg-gray-300"
                }`}
              />
            </span>
            <span
              className={`transition-colors duration-150 ${
                isChecked ? "text-teal-500" : "text-gray-900"
              }`}
            >
              {option.label}
            </span>
          </label>
        );
      })}
    </div>
  );
};

export default Radio;
