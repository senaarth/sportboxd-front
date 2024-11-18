import { formatDateLabel } from "@/utils/date";
import { useMemo } from "react";
import { MatchCard } from "./match-card";

function splitMatchesByDate(matches: Match[]) {
  let matchesByDate: Record<string, Match[]> = {};

  matches.forEach((match) => {
    const formatedDate = formatDateLabel(match.date);

    if (matchesByDate[formatedDate]) {
      matchesByDate[formatedDate].push(match);
      return;
    }

    matchesByDate[formatedDate] = [match];
  });

  return matchesByDate;
}

interface MatchesByDateListProps {
  matches: Match[];
}

export function MatchesByDateList({ matches }: MatchesByDateListProps) {
  const matchesByDate = useMemo(() => splitMatchesByDate(matches), [matches]);
  return Object.keys(splitMatchesByDate(matches)).map((date, index) => {
    return (
      <div
        key={`${date}-${index}`}
        className="w-full flex flex-col items-start"
      >
        <p className="mb-3 mt-2">{date}</p>
        <div className="w-full flex flex-col gap-2">
          {matchesByDate[date].map((match) => {
            return <MatchCard key={match.matchId} {...match} />;
          })}
        </div>
      </div>
    );
  });
}