import axios, { InternalAxiosRequestConfig } from "axios";

import { getNextDay } from "./utils/date";
import { getUserToken } from "./lib/firebase";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL,
});

export async function authorization(
  config: InternalAxiosRequestConfig<any>
): Promise<InternalAxiosRequestConfig<any>> {
  const token = await getUserToken();

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
}

api.interceptors.request.use(authorization);

async function getMatches(
  since: Date | undefined,
  until: Date | undefined,
  league: string,
  currentPage: number,
  orderBy: string
) {
  return await api
    .get(`/matches/`, {
      params: {
        since: since?.toISOString(),
        until: until ? getNextDay(until).toISOString() : undefined,
        league,
        skip: 15 * currentPage,
        limit: 15,
        order_by: orderBy,
      },
    })
    .then(({ data }) => {
      return {
        matches: data.matches.map((match: RemoteMatch) => {
          const ratingProportion = match.count_by_rating
            ? {
                "1": match.count_by_rating["1"] / match.ratings_num,
                "2": match.count_by_rating["2"] / match.ratings_num,
                "3": match.count_by_rating["3"] / match.ratings_num,
                "4": match.count_by_rating["4"] / match.ratings_num,
                "5": match.count_by_rating["5"] / match.ratings_num,
              }
            : {
                "1": 0,
                "2": 0,
                "3": 0,
                "4": 0,
                "5": 0,
              };
          const date = new Date(match.date);

          date.setHours(date.getHours() - 3);

          return {
            ...match,
            date,
            matchId: match._id,
            homeTeam: match.home_team,
            homeScore: match.home_score,
            awayTeam: match.away_team,
            awayScore: match.away_score,
            ratingsNum: match.ratings_num,
            avgRating: match.avg_rating ? match.avg_rating.toFixed(1) : 0,
            ratingProportion,
          };
        }),
        totalCount: data.total_count,
      };
    })
    .catch((error) => {
      console.log("error", error);
      // throw new Error("Erro ao buscar as partidas");
      return { matches: [], totalCount: 0 };
    });
}

async function getMatchById(matchId: string) {
  return await api
    .get(`/matches/${matchId}`)
    .then(({ data: match }) => {
      const ratingProportion = match.count_by_rating
        ? {
            "1": match.count_by_rating["1"] / match.ratings_num,
            "2": match.count_by_rating["2"] / match.ratings_num,
            "3": match.count_by_rating["3"] / match.ratings_num,
            "4": match.count_by_rating["4"] / match.ratings_num,
            "5": match.count_by_rating["5"] / match.ratings_num,
          }
        : {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
          };
      const date = new Date(match.date);

      date.setHours(date.getHours() - 3);

      return {
        ...match,
        date,
        matchId: match._id,
        homeTeam: match.home_team,
        homeScore: match.home_score,
        awayTeam: match.away_team,
        awayScore: match.away_score,
        ratingsNum: match.ratings_num,
        avgRating: match.avg_rating ? match.avg_rating.toFixed(1) : 0,
        ratingProportion: ratingProportion,
      };
    })
    .catch(() => {
      // throw new Error("Erro ao buscar partida");
      return {
        matchId: "not-found",
        date: new Date(),
        homeTeam: "Time A",
        homeScore: 0,
        awayTeam: "Time B",
        awayScore: 0,
        ratingsNum: 0,
        avgRating: 0,
        ratingProportion: {
          "1": 0,
          "2": 0,
          "3": 0,
          "4": 0,
          "5": 0,
        },
      };
    });
}

async function getMatchRatings(matchId: string, ratingId: string | null) {
  const ratingIdParam = ratingId ? `?first_rating_id=${ratingId}` : "";

  return await api
    .get(`/ratings/${matchId}` + ratingIdParam)
    .then(({ data }) => {
      return data.map((rating: RemoteRating) => {
        const createdAt = new Date(rating.created_at);
        createdAt.setHours(createdAt.getHours() - 3);
        return {
          ...rating,
          ratingId: rating._id,
          matchId: rating.match_id,
          createdAt,
        };
      });
    })
    .catch(() => {
      // throw new Error("Erro ao buscar as partidas");
      return [];
    });
}

async function postRating(data: {
  title: string;
  rating: number;
  comment: string;
  match_id: string;
}) {
  await api.post(`/ratings/`, data).catch(() => {
    throw new Error("Erro ao publicar avaliação");
  });
}

export { getMatches, getMatchById, getMatchRatings, postRating };
