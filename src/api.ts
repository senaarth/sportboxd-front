import axios from "axios";

import { getNextDay } from "./utils/date";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

async function getMatches(
  since: Date | undefined,
  until: Date | undefined,
  league: string,
  currentPage: number,
  orderBy: string
) {
  return await axios
    .get(`${baseUrl}/matches/`, {
      params: {
        since: since?.toLocaleDateString("pt-BR"),
        until: until
          ? getNextDay(until).toLocaleDateString("pt-BR")
          : undefined,
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

          return {
            ...match,
            matchId: match._id,
            date: new Date(match.date),
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
  return await axios
    .get(`${baseUrl}/matches/${matchId}`)
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

      return {
        ...match,
        matchId: match._id,
        date: new Date(match.date),
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

  return await axios
    .get(`${baseUrl}/ratings/${matchId}` + ratingIdParam)
    .then(({ data }) => {
      return data.map((rating: RemoteRating) => ({
        ...rating,
        ratingId: rating._id,
        matchId: rating.match_id,
        createdAt: new Date(rating.created_at),
      }));
    })
    .catch(() => {
      // throw new Error("Erro ao buscar as partidas");
      return [];
    });
}

async function postRating(data: {
  title: string;
  rating: number;
  author: string;
  comment: string;
  match_id: string;
}) {
  await axios.post(`${baseUrl}/ratings/`, data).catch(() => {
    throw new Error("Erro ao publicar avaliação");
  });
}

export { getMatches, getMatchById, getMatchRatings, postRating };
