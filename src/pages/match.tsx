import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { formatDateLabel } from "../utils/date";
import { Loading } from "../components/loading";

const CrestComponent = ({ team }: { team: string }) => {
  return (
    <div className="w-full flex flex-col items-center px-3 gap-2">
      <object
        className="h-11"
        data={`https://api.sportboxd.com/crests/${team}.svg`}
        type="image/svg"
      >
        <img
          className="h-11"
          src="/crest_fallback.png"
          alt={`escudo do time da casa, ${team}`}
        />
      </object>
      <p className="text-base text-neutral-200">{team}</p>
    </div>
  );
};

export default function Match() {
  const params = useParams();
  const navigate = useNavigate();
  const {
    data: match,
    error,
    isLoading,
  } = useQuery(["match", params.id], () => {
    return {
      date: new Date(),
      matchId: 1,
      homeTeam: "Flamengo",
      homeScore: 0,
      awayTeam: "Vasco",
      awayScore: 10,
      avgRating: 4.5,
      ratingsNum: 10000,
    };
  });
  const {
    data: ratings,
    error: ratingsError,
    isLoading: isLoadingRatings,
  } = useQuery(["ratings", params.id], () => {
    return [
      {
        id: 1,
        author: "senaarth",
        title: "Flamengo 🤏🏾",
        comment: "Flamengo você não é presidente mais.",
        rating: 5,
        date: new Date(),
      },
      {
        id: 2,
        author: "senaarth",
        title: "Flamengo 🤏🏾",
        comment: "Flamengo você não é presidente mais.",
        rating: 5,
        date: new Date(),
      },
    ];
  });

  if (isLoading || error || !match)
    return (
      <div className="w-full h-svh flex items-center justify-center bg-neutral-950">
        <Loading />
      </div>
    );

  return (
    <div className="w-full h-svh bg-neutral-950">
      <div className="w-full flex items-center justify-center px-4 py-6 bg-neutral-900">
        <div className="w-full max-w-4xl flex flex-col items-start justify-start gap-4">
          <button
            className="flex items-center justify-center gap-2 text-base text-neutral-200 hover:brightness-75 transition-all"
            onClick={() => navigate("/")}
            type="button"
          >
            <img
              className="w-5 h-5 p-[2px] -rotate-90"
              src="/icons/chevron_up.svg"
              alt="ícone de seta para a esquerda"
            />
            Voltar
          </button>
          <div className="w-full p-4 grid grid-cols-3">
            <CrestComponent team={match.homeTeam} />
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-neutral-500">
                {formatDateLabel(match.date)}
              </p>
              <p className="text-3xl text-neutral-200 font-semibold">
                {match?.homeScore} - {match?.awayScore}
              </p>
              <p className="text-xs text-neutral-200">Encerrado</p>
            </div>
            <CrestComponent team={match.awayTeam} />
          </div>
        </div>
      </div>
      <div className="w-full max-w-4xl flex flex-col items-center justify-start p-4 mx-auto">
        <button
          className="w-full text-sm text-neutral-200 py-2 hover:brightness-110 flex items-center justify-between"
          type="button"
        >
          Toque para avaliar
        </button>
        <span className="w-full h-[1px] bg-neutral-800 my-4" />
        <div className="w-full flex items-center justify-start py-2">
          <div className="flex flex-col items-start text-neutral-200 p-2 gap-1">
            <p className="text-sm">Avaliações</p>
            <p className="text-4xl font-semibold">{match.avgRating}/5</p>
          </div>
        </div>
        <div className="w-full flex flex-col items-center justify-start gap-2 mt-4">
          {isLoadingRatings || ratingsError || !ratings ? (
            <Loading />
          ) : (
            ratings.map((rating) => (
              <div
                key={`rating-${rating.id}`}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-md text-neutral-200 p-4"
              >
                <div className="w-full flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold">{rating.title}</p>
                  </div>
                  <div className="flex flex-col items-end justify-center">
                    <p className="text-xs font-semibold">{rating.author}</p>
                    <p className="text-xs text-neutral-600">
                      {formatDateLabel(rating.date)}
                    </p>
                  </div>
                </div>
                <p className="text-sm mt-4">{rating.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
