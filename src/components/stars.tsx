import { useState } from "react";
import { twMerge } from "tailwind-merge";

const colorVariants = {
  lime: "bg-lime-500",
  neutral: "bg-neutral-500",
};

const hoverVariants = {
  lime: "hover:bg-lime-500",
  neutral: "hover:bg-neutral-500",
};

const sizeVariants = {
  xs: "",
  sm: "",
  base: "",
  lg: "w-[26px] h-[26px]",
};

interface StarsProps {
  color: "lime" | "neutral";
  number: number;
  onStarClick?: (rating: number) => void;
  size: "xs" | "sm" | "base" | "lg";
}

export function Stars({ color, number, onStarClick, size }: StarsProps) {
  const [starsToHighlightNum, setStarsToHighlightNum] =
    useState<number>(number);

  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2, 3, 4].map((item) => {
        return (
          <div
            className={twMerge(
              "flex items-center justify-center",
              sizeVariants[size]
            )}
            style={{
              maskImage: `url(/icons/star_mask.svg)`,
              maskSize: "100%",
              maskRepeat: "no-repeat",
            }}
          >
            <button
              className={twMerge(
                "w-[50%] h-full transition-all",
                item + 0.5 <= starsToHighlightNum
                  ? colorVariants[color]
                  : "bg-neutral-800",
                onStarClick ? hoverVariants[color] : ""
              )}
              onClick={() => (onStarClick ? onStarClick(item + 0.5) : null)}
              onMouseEnter={() => {
                if (!onStarClick) return;
                setStarsToHighlightNum(item + 0.5);
              }}
              onMouseLeave={() => {
                if (!onStarClick) return;
                setStarsToHighlightNum(number);
              }}
              type="button"
            ></button>
            <button
              className={twMerge(
                "w-[50%] h-full transition-all",
                item + 1 <= starsToHighlightNum
                  ? colorVariants[color]
                  : "bg-neutral-800",
                onStarClick ? hoverVariants[color] : ""
              )}
              onClick={() => (onStarClick ? onStarClick(item + 1) : null)}
              onMouseEnter={() => {
                if (!onStarClick) return;
                setStarsToHighlightNum(item + 1);
              }}
              onMouseLeave={() => {
                if (!onStarClick) return;
                setStarsToHighlightNum(number);
              }}
              type="button"
            ></button>
          </div>
        );
      })}
    </div>
  );
}
