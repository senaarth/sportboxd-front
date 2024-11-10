import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";

import Home from "./pages/home";
import Match from "./pages/match";

export function Router() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/partidas/:id",
      element: <Match />,
    },
  ]);

  return <RouterProvider router={router} />;
}
