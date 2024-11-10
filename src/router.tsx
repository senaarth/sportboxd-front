import { lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const Home = lazy(() => import("./pages/home"));

export function Router() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
  ]);

  return <RouterProvider router={router} />;
}
