import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

async function getMatches(since: string, league: string) {
  return await axios
    .get(`${baseUrl}/matches/`, { params: { since, league } })
    .then(({ data }) => {
      return data.map((match: RemoteMatch) => ({
        ...match,
        matchId: match._id,
        date: new Date(match.date),
        homeTeam: match.home_team,
        homeScore: match.home_score,
        awayTeam: match.away_team,
        awayScore: match.away_score,
        ratingsNum: match.ratings_num,
        avgRating: match.avg_rating.toFixed(1),
        ratingProportion: {
          "1": match.count_by_rating["1"] / match.ratings_num,
          "2": match.count_by_rating["2"] / match.ratings_num,
          "3": match.count_by_rating["3"] / match.ratings_num,
          "4": match.count_by_rating["4"] / match.ratings_num,
          "5": match.count_by_rating["5"] / match.ratings_num,
        },
      }));
    })
    .catch(() => {
      // throw new Error("Erro ao buscar as partidas");
      return [];
    });
}

async function getMatchById(matchId: string) {
  return await axios
    .get(`${baseUrl}/matches/${matchId}`)
    .then(({ data: match }) => {
      return {
        ...match,
        matchId: match._id,
        date: new Date(match.date),
        homeTeam: match.home_team,
        homeScore: match.home_score,
        awayTeam: match.away_team,
        awayScore: match.away_score,
        ratingsNum: match.ratings_num,
        avgRating: match.avg_rating.toFixed(1),
        ratingProportion: {
          "1": match.count_by_rating["1"] / match.ratings_num,
          "2": match.count_by_rating["2"] / match.ratings_num,
          "3": match.count_by_rating["3"] / match.ratings_num,
          "4": match.count_by_rating["4"] / match.ratings_num,
          "5": match.count_by_rating["5"] / match.ratings_num,
        },
      };
    })
    .catch(() => {
      // throw new Error("Erro ao buscar partida");
      return {};
    });
}

async function getMatchRatings(matchId: string) {
  return await axios
    .get(`${baseUrl}/ratings/${matchId}`)
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
