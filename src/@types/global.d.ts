export {};

declare global {
  type Match = {
    avgRating: number;
    matchId: string;
    date: Date;
    homeTeam: string;
    homeScore: number;
    awayTeam: string;
    awayScore: number;
    league: string;
    ratingsNum: number;
    ratingProportion: {
      "1": number;
      "2": number;
      "3": number;
      "4": number;
      "5": number;
    };
    status: string;
  };

  type Rating = {
    ratingId: string;
    createdAt: Date;
    matchId: string;
    title: string;
    author: string;
    comment: string;
    rating: number;
  };

  type RemoteMatch = {
    _id: string;
    date: string;
    home_team: string;
    home_score: number;
    away_team: string;
    away_score: number;
    ratings_num: number;
    avg_rating: number;
    league: string;
    count_by_rating: {
      "1": number;
      "2": number;
      "3": number;
      "4": number;
      "5": number;
    };
    status: string;
  };

  type RemoteRating = {
    _id: string;
    created_at: string;
    match_id: string;
    title: string;
    author: string;
    content: string;
    rating: number;
  };
}
