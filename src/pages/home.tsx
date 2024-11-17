import { useEffect, useState } from "react";

import { DatePicker } from "../components/date-picker";
import { LeagueChip } from "../components/league-chip";
import { useQuery } from "react-query";
import { MatchCard } from "../components/match-card";
import { Loading } from "../components/loading";
import { getMatches } from "../api";
import { useAuth } from "../contexts/auth";
import { twMerge } from "tailwind-merge";

type League = {
  code: string;
  sport: "soccer";
  label: string;
};

const AVAILABLE_LEAGUES: League[] = [
  {
    code: "BSA",
    sport: "soccer",
    label: "Brasileirão - Série A",
  },
  {
    code: "PL",
    sport: "soccer",
    label: "Premier League",
  },
];

export default function Home() {
  const localDate = localStorage.getItem("sportboxd:selected_date");
  const localLeague = localStorage.getItem("sportboxd:selected_league");
  const { isAuthenticated, handleLogout, openLoginModal } = useAuth();
  const [selectedLeague, selectLeague] = useState<League>(
    localLeague ? JSON.parse(localLeague) : AVAILABLE_LEAGUES[0]
  );
  const [selectedDate, selectDate] = useState<Date>(
    localDate ? new Date(localDate) : new Date()
  );
  const {
    isLoading,
    error,
    data: matchesData,
  } = useQuery<{ matches: Match[]; totalCount: number }>(
    ["matches", selectedLeague.code, selectedDate.toLocaleDateString("pt-BR")],
    async () => {
      const results = await getMatches(
        selectedDate,
        selectedDate,
        selectedLeague.code
      );
      return results;
    }
  );

  useEffect(() => {
    localStorage.setItem(
      "sportboxd:selected_date",
      selectedDate.toLocaleDateString()
    );
    localStorage.setItem(
      "sportboxd:selected_league",
      JSON.stringify(selectedLeague)
    );
  }, [selectedDate, selectedLeague]);

  return (
    <div className="bg-neutral-950 w-full min-h-svh flex flex-col items-center justify-start px-4 py-5 gap-5">
      <div className="w-full max-w-4xl flex items-center justify-between">
        <img
          alt="Logo sportboxd, imagem com nome do site escrito"
          className="h-7"
          src="sportboxd.svg"
        />
        <button
          className={twMerge(
            "text-sm px-2 py-1",
            isAuthenticated ? "text-neutral-200" : "text-lime-500"
          )}
          onClick={isAuthenticated ? handleLogout : openLoginModal}
          type="button"
        >
          {isAuthenticated ? "Sair" : "Entrar"}
        </button>
      </div>
      <div className="flex flex-row items-center justify-start w-full max-w-4xl">
        {AVAILABLE_LEAGUES.map((league) => (
          <LeagueChip
            key={league.code}
            {...league}
            isSelected={league.code === selectedLeague.code}
            onClick={() => selectLeague(league)}
          />
        ))}
      </div>
      {/* <div className="w-full max-w-4xl flex flex-col gap-1.5 items-center md:flex-row md:gap-4 md:items-start"> */}
      <div className="w-full max-w-4xl">
        <DatePicker
          defaultValue={selectedDate}
          onDatePick={(date: Date) => selectDate(date)}
        />
      </div>
      {/* <p className="text-sm text-neutral-200 text-center md:h-10 md:leading-10">
          até
        </p>
        <DatePicker
          defaultValue={selectedEndDate}
          onDatePick={(date: Date) => selectEndDate(date)}
        />
      </div> */}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {error ? null : (
            <div className="w-full max-w-4xl flex flex-col items-center justify-start gap-2">
              {matchesData?.matches.length ? (
                matchesData.matches.map((match) => (
                  <MatchCard key={match.matchId} {...match} />
                ))
              ) : (
                <p className="text-sm text-neutral-200 mt-5 text-center max-w-96">
                  Parece que não encontramos partidas nas datas/ligas
                  selecionadas, que tal mudar os filtros?
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
