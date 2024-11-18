import { useEffect, useState } from "react";

import { DatePicker } from "../components/date-picker";
import { LeagueChip } from "../components/league-chip";
import { useInfiniteQuery } from "react-query";
import { Loading } from "../components/loading";
import { getMatches } from "../api";
import { useAuth } from "../contexts/auth";
import { twMerge } from "tailwind-merge";
import { MatchesByDateList } from "@/components/matches-by-date-list";

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
  const localLeague = localStorage.getItem("sportboxd:selected_league");
  const { isAuthenticated, handleLogout, openLoginModal } = useAuth();
  const [selectedLeague, selectLeague] = useState<League>(
    localLeague ? JSON.parse(localLeague) : AVAILABLE_LEAGUES[0]
  );
  const [selectedDate, selectDate] = useState<Date | undefined>(undefined);
  const {
    data: matchesData,
    error: error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<{ matches: Match[]; totalCount: number }>(
    ["matches", selectedLeague.code, selectedDate?.toLocaleDateString("pt-BR")],
    async ({ pageParam = 0 }) => {
      const results = await getMatches(
        selectedDate,
        selectedDate,
        selectedLeague.code,
        pageParam
      );
      return results;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const totalPages = Math.ceil(
          lastPage.totalCount / lastPage.matches.length
        );
        const nextPage = allPages.length + 1;
        return nextPage <= totalPages ? nextPage : undefined;
      },
    }
  );

  useEffect(() => {
    const localDate = localStorage.getItem("sportboxd:selected_date");

    if (localDate)
      if (!isNaN(new Date(localDate).getTime()))
        selectDate(new Date(localDate));
  }, []);

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
            onClick={() => {
              selectLeague(league);
              localStorage.setItem(
                "sportboxd:selected_league",
                JSON.stringify(league)
              );
            }}
          />
        ))}
      </div>
      <div className="w-full max-w-4xl">
        <DatePicker
          defaultValue={selectedDate || undefined}
          onDatePick={(date: Date | undefined) => {
            selectDate(date);
            if (date)
              localStorage.setItem(
                "sportboxd:selected_date",
                date.toLocaleDateString()
              );
            else localStorage.removeItem("sportboxd:selected_date");
          }}
        />
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {error ? null : (
            <div className="w-full max-w-4xl flex flex-col items-center justify-start gap-2">
              {matchesData?.pages.every((page) => page.matches.length === 0) ? (
                <p className="text-sm text-neutral-200 mt-5 text-center max-w-96">
                  Parece que não encontramos partidas nas datas/ligas
                  selecionadas, que tal mudar os filtros?
                </p>
              ) : (
                <>
                  {matchesData?.pages.map((page) => (
                    <MatchesByDateList
                      key={`matches-page-${page}`}
                      matches={page.matches}
                    />
                  ))}
                  {hasNextPage && (
                    <button
                      className="my-5 text-base hover:underline"
                      onClick={() => fetchNextPage()}
                      type="button"
                    >
                      {isFetchingNextPage ? <Loading /> : "Ver mais"}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
