import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { Stars } from "./stars";

interface MatchCardProps {
  matchId: string;
  homeTeam: string;
  homeScore: number;
  awayTeam: string;
  awayScore: number;
  avgRating: number;
  ratingsNum: number;
  date: Date;
  league: string;
}

export function MatchCard({
  matchId,
  homeTeam,
  homeScore,
  awayTeam,
  awayScore,
  avgRating,
  ratingsNum,
  league,
}: MatchCardProps) {
  const navigate = useNavigate();

  return (
    <button
      className="w-full rounded-md flex flex-col gap-4 p-4 border border-neutral-800 bg-neutral-900 hover:border-neutral-700 hover:bg-neutral-800"
      onClick={() => navigate(`/partidas/${matchId}`)}
      type="button"
    >
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-row items-center justify-start gap-1">
          <img
            className="h-11"
            src={`/crests/${league}/${homeTeam}.png`}
            alt={`escudo do time da casa, ${homeTeam}`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/crest_fallback.png";
            }}
          />
          <p className="text-base text-neutral-100">{homeTeam}</p>
          <p
            className={twMerge(
              "text-lg ml-auto",
              homeScore > awayScore ? "text-neutral-100" : "text-neutral-400"
            )}
          >
            {homeScore}
          </p>
        </div>
        <div className="w-full flex flex-row items-center justify-start gap-1">
          <img
            className="h-11"
            src={`/crests/${league}/${awayTeam}.png`}
            alt={`escudo do time da casa, ${awayTeam}`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/crest_fallback.png";
            }}
          />
          <p className="text-base text-neutral-100">{awayTeam}</p>
          <p
            className={twMerge(
              "text-lg ml-auto",
              awayScore > homeScore ? "text-neutral-100" : "text-neutral-400"
            )}
          >
            {awayScore}
          </p>
        </div>
      </div>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Stars color="lime" number={avgRating} size="xs" />
          <p className="text-xs text-neutral-100">{avgRating}/5</p>
        </div>
        <p className="text-neutral-500 text-xs">{ratingsNum} avaliações</p>
      </div>
    </button>
  );
}
