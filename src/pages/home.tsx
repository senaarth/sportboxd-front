import { useState } from "react";

import { DatePicker } from "../components/date-picker";
import { LeagueChip } from "../components/league-chip";
import { useQuery } from "react-query";
import { MatchCard } from "../components/match-card";
import { Loading } from "../components/loading";

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
  const {
    isLoading,
    error,
    data: matches,
  } = useQuery(["matches"], () => [
    {
      matchId: 1,
      homeTeam: "Flamengo",
      homeScore: 0,
      awayTeam: "Vasco",
      awayScore: 9,
      avgRating: 4.5,
      ratingsNum: 10000,
    },
    {
      matchId: 2,
      homeTeam: "Flamengo",
      homeScore: 0,
      awayTeam: "Vasco",
      awayScore: 7,
      avgRating: 4.5,
      ratingsNum: 10000,
    },
  ]);

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
            key={league.code}
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
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {error ? null : (
            <div className="w-full max-w-4xl flex flex-col items-center justify-start gap-2">
              {matches?.map((match) => (
                <MatchCard key={match.matchId} {...match} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
