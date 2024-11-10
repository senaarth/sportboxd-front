import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface MatchCardProps {
  matchId: number;
  homeTeam: string;
  homeScore: number;
  awayTeam: string;
  awayScore: number;
  avgRating: number;
  ratingsNum: number;
}

export function MatchCard({
  matchId,
  homeTeam,
  homeScore,
  awayTeam,
  awayScore,
  avgRating,
  ratingsNum,
}: MatchCardProps) {
  const navigate = useNavigate();

  return (
    <button
      className="w-full rounded-md flex flex-col gap-4 p-4 border border-neutral-600 bg-neutral-800"
      onClick={() => navigate(`/partidas/${matchId}`)}
      type="button"
    >
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-row items-center justify-start gap-1">
          <object
            className="h-5"
            data={`https://api.sportboxd.com/crests/${homeTeam}.svg`}
            type="image/svg"
          >
            <img
              className="h-5"
              src="crest_fallback.png"
              alt={`escudo do time da casa, ${homeTeam}`}
            />
          </object>
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
          <object
            className="h-5"
            data={`https://api.sportboxd.com/crests/${awayTeam}.svg`}
            type="image/svg"
          >
            <img
              className="h-5"
              src="crest_fallback.png"
              alt={`escudo do time visitante, ${awayTeam}`}
            />
          </object>
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
        <p className="text-sm text-neutral-100">{avgRating}/5</p>
        <p className="text-neutral-500 text-xs">{ratingsNum} avaliações</p>
      </div>
    </button>
  );
}
