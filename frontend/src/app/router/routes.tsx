import { createBrowserRouter } from "react-router-dom";

import { appPaths } from "@/app/router/paths";
import { HomePage } from "@/app/router/pages/HomePage";
import { NotFoundPage } from "@/app/router/pages/NotFoundPage";
import { PublicLayout } from "@/layouts/PublicLayout";
import { RootLayout } from "@/layouts/RootLayout";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            path: appPaths.home,
            element: <HomePage />,
          },
        ],
      },
      {
        path: appPaths.notFound,
        element: <NotFoundPage />,
      },
    ],
  },
]);
