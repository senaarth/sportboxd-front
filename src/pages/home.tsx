import { useState } from "react";

import { DatePicker } from "../components/date-picker";
import { LeagueChip } from "../components/league-chip";

type League = {
  code: string;
  sport: "soccer";
  label: string;
};

const AVAILABLE_LEAGUES: League[] = [
  {
    code: "BRA",
    sport: "soccer",
    label: "Brasileirão - Série A",
  },
  {
    code: "PL",
    sport: "soccer",
    label: "Premiere League",
  },
];

export default function Home() {
  const [selectedLeague, selectLeague] = useState<League>(AVAILABLE_LEAGUES[0]);

  return (
    <div className="bg-neutral-950 w-full h-svh flex flex-col items-center justify-start px-4 py-5 gap-5">
      <div className="w-full max-w-4xl">
        <img
          alt="Logo sportboxd, imagem com nome do site escrito"
          className="h-7"
          src="sportboxd.svg"
        />
      </div>
      <div className="flex flex-row items-center justify-start w-full max-w-4xl">
        {AVAILABLE_LEAGUES.map((league) => (
          <LeagueChip
            {...league}
            isSelected={league === selectedLeague}
            onClick={() => selectLeague(league)}
          />
        ))}
      </div>
      <div className="w-full max-w-4xl flex">
        <DatePicker
          onDatePick={(date: Date) => {
            console.log(date);
          }}
        />
      </div>
    </div>
  );
}
