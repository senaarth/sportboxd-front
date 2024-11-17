import { useQuery } from "react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { formatDateLabel } from "../utils/date";
import { Loading } from "../components/loading";
import { Stars } from "../components/stars";
import { RatingModal } from "../components/rating-modal";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { getMatchById, getMatchRatings } from "../api";
import { LoadingScreen } from "@/components/loading-screen";
import { ShareRatingModal } from "@/components/share-rating-modal";

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

const RatingCard = ({
  rating,
  setRatingToShare,
}: {
  rating: Rating;
  setRatingToShare: Dispatch<SetStateAction<Rating | null>>;
}) => {
  return (
    <div
      key={`rating-${rating.ratingId}`}
      className="w-full bg-neutral-900 border border-neutral-800 rounded-md text-neutral-200 p-4"
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col items-start justify-start gap-0.5">
          <p className="text-base font-semibold">{rating.title}</p>
          <Stars color="lime" number={rating.rating} size="xs" />
        </div>
        <div className="flex flex-col items-end justify-center">
          <p className="text-xs font-semibold">{rating.author}</p>
          <p className="text-xs text-neutral-600">
            {formatDateLabel(rating.createdAt)}
          </p>
        </div>
      </div>
      <p className="text-sm mt-4">{rating.comment}</p>
      <div className="w-full flex items-center justify-between mt-2">
        <button
          className="p-1 rounded hover:bg-neutral-800 ml-auto"
          onClick={() => setRatingToShare(rating)}
          type="button"
        >
          <img
            className="w-4 h-4"
            src="/icons/share.svg"
            alt="ícone de compartilhar"
          />
        </button>
      </div>
    </div>
  );
};

const CrestComponent = ({ league, team }: { league: string; team: string }) => {
  return (
    <div className="w-full flex flex-col items-center px-3 gap-2">
      <img
        className="h-11"
        src={`/crests/${league}/${team}.png`}
        alt={`escudo do time da casa, ${team}`}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/crest_fallback.png";
        }}
      />
      <p className="text-base text-neutral-200">{team}</p>
    </div>
  );
};

export default function MatchPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isRatingModalOpen, setRatingModalOpen] = useState<boolean>(false);
  const [ratingToShare, setRatingToShare] = useState<Rating | null>(null);
  const [ratingValue, setRatingValue] = useState<number>(0);
  const ratingId = searchParams.get("rating_id");
  const {
    data: match,
    error,
    isLoading,
    refetch: refetchMatch,
  } = useQuery<Match>(["match", params.id], async () => {
    if (!params.id) return {};
    return await getMatchById(params.id);
  });
  const {
    data: ratings,
    error: ratingsError,
    isLoading: isLoadingRatings,
    refetch: refetchRatings,
  } = useQuery<Rating[]>(["ratings", params.id, ratingId], async () => {
    if (!params.id) return [];
    return await getMatchRatings(params.id, ratingId);
  });
  const sharedRating = useMemo(
    () => ratings?.find((rating) => rating.ratingId === ratingId),
    [ratingId, ratings]
  );

  if (isLoading || error || !match) return <LoadingScreen />;

  return (
    <div className="w-full min-h-svh bg-neutral-950">
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
            <CrestComponent league={match.league} team={match.homeTeam} />
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-neutral-500">
                {formatDateLabel(match.date)}
              </p>
              <p className="text-3xl text-neutral-200 font-semibold">
                {match?.homeScore} - {match?.awayScore}
              </p>
              <p className="text-xs text-neutral-200">Encerrado</p>
            </div>
            <CrestComponent league={match.league} team={match.awayTeam} />
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
              setRatingValue(value);
              setRatingModalOpen(true);
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
                <>
                  {sharedRating ? (
                    <>
                      <p className="h-6 px-2 py-0.5 bg-lime-500 rounded-md text-xs mr-auto leading-5 text-neutral-950">
                        Compartilhado com você
                      </p>
                      <RatingCard
                        rating={sharedRating}
                        setRatingToShare={setRatingToShare}
                      />
                      <span className="w-full h-[1px] bg-neutral-800 my-4" />
                    </>
                  ) : null}
                  {ratings.map((rating) =>
                    rating.ratingId !== sharedRating?.ratingId ? (
                      <RatingCard
                        key={rating.ratingId}
                        rating={rating}
                        setRatingToShare={setRatingToShare}
                      />
                    ) : null
                  )}
                </>
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
      {isRatingModalOpen ? (
        <RatingModal
          defaultValue={ratingValue}
          isOpen={isRatingModalOpen}
          match={match}
          onClose={() => setRatingModalOpen(false)}
          onSubmitError={() => {}}
          onSubmitSuccess={() => {
            setRatingModalOpen(false);
            refetchRatings();
            refetchMatch();
          }}
        />
      ) : null}
      {ratingToShare ? (
        <ShareRatingModal
          isOpen={!!ratingToShare}
          onClose={() => setRatingToShare(null)}
          rating={ratingToShare}
          match={match}
        />
      ) : null}
    </div>
  );
}
