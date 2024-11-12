import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { formatDateLabel } from "../utils/date";
import { Loading } from "../components/loading";
import { Stars } from "../components/stars";
import { RatingModal } from "../components/rating-modal";
import { useState } from "react";
import { getMatchRatings } from "../api";

const RatingProportionComponent = ({
  rating,
  proportion,
}: {
  rating: number;
  proportion: number;
}) => {
  return (
    <div className="flex items-center gap-1">
      <div className="w-14 h-[3px] bg-neutral-800 flex items-center justify-start rounded overflow-hidden">
        <span
          className="h-1 bg-neutral-600"
          style={{ width: `${proportion * 100}%` }}
        />
      </div>
      <Stars color="neutral" number={rating} size="2xs" />
    </div>
  );
};

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
  const [isRatingModalOpen, setRatingModalOpen] = useState<boolean>(false);
  const [ratingValue, setRatingValue] = useState<number>(0);
  const {
    data: match,
    error,
    isLoading,
  } = useQuery<Match>(["match", params.id], () => {
    return {
      date: new Date(),
      matchId: "1",
      homeTeam: "Flamengo",
      homeScore: 0,
      awayTeam: "Vasco",
      awayScore: 10,
      avgRating: 4.5,
      ratingsNum: 10000,
      ratingProportion: {
        "1": 0.05,
        "2": 0.05,
        "3": 0.1,
        "4": 0.2,
        "5": 0.7,
      },
    };
  });
  const {
    data: ratings,
    error: ratingsError,
    isLoading: isLoadingRatings,
  } = useQuery<Rating[]>(["ratings", params.id], async () => {
    if (!params.id) return [];
    return await getMatchRatings(params.id);
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
        <div className="w-full flex items-center justify-between py-2">
          <p className="text-sm text-neutral-200">Toque para avaliar</p>
          <Stars
            color="lime"
            number={0}
            onStarClick={(value) => {
              setRatingModalOpen(true);
              setRatingValue(value);
            }}
            size="lg"
          />
        </div>
        <span className="w-full h-[1px] bg-neutral-800 my-4" />
        <div className="w-full flex items-center justify-start py-2">
          <div className="flex flex-col items-start text-neutral-200 p-2 gap-1">
            <p className="text-sm">Avaliações</p>
            <p className="text-4xl font-semibold">{match.avgRating}/5</p>
          </div>
          <div className="ml-auto flex flex-col items-end justify-start gap-1">
            <RatingProportionComponent
              rating={5}
              proportion={match.ratingProportion[5]}
            />
            <RatingProportionComponent
              rating={4}
              proportion={match.ratingProportion[4]}
            />
            <RatingProportionComponent
              rating={3}
              proportion={match.ratingProportion[3]}
            />
            <RatingProportionComponent
              rating={2}
              proportion={match.ratingProportion[2]}
            />
            <RatingProportionComponent
              rating={1}
              proportion={match.ratingProportion[1]}
            />
            <p className="text-neutral-500 text-xs mt-1">
              {match.ratingsNum} avaliações
            </p>
          </div>
        </div>
        <div className="w-full flex flex-col items-center justify-start gap-2 mt-4">
          {isLoadingRatings || ratingsError || !ratings ? (
            <Loading />
          ) : (
            <>
              {ratings.length ? (
                ratings.map((rating) => (
                  <div
                    key={`rating-${rating.ratingId}`}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md text-neutral-200 p-4"
                  >
                    <div className="w-full flex items-center justify-between">
                      <div>
                        <p className="text-base font-semibold">
                          {rating.title}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-center">
                        <p className="text-xs font-semibold">{rating.author}</p>
                        <p className="text-xs text-neutral-600">
                          {formatDateLabel(rating.createdAt)}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm mt-4">{rating.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-neutral-200 text-center mt-5">
                  Parace que não há avaliações para essa partida, que tal{" "}
                  <button
                    className="font-medium text-lime-500"
                    onClick={() => setRatingModalOpen(true)}
                    type="button"
                  >
                    fazer a primeira?
                  </button>
                </p>
              )}
            </>
          )}
        </div>
      </div>
      <RatingModal
        defaultValue={ratingValue}
        isOpen={isRatingModalOpen}
        match={match}
        onClose={() => setRatingModalOpen(false)}
      />
    </div>
  );
}
