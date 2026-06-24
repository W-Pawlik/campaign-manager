import { createBrowserRouter } from "react-router-dom";

import { appPaths } from "@/app/router/paths";
import { HomePage } from "@/app/router/pages/HomePage";
import { NotFoundPage } from "@/app/router/pages/NotFoundPage";
import { AnonymousRoute } from "@/core/auth/AnonymousRoute";
import { ProtectedRoute } from "@/core/auth/ProtectedRoute";
import { AuthPage } from "@/features/auth";
import { CampaignCharactersPage } from "@/features/characters";
import { CampaignChroniclePage } from "@/features/chronicle";
import { CampaignOverviewPage } from "@/features/campaigns";
import { CampaignInventoryPage } from "@/features/inventory";
import { ItemsCatalogPage } from "@/features/items";
import { CampaignLocationsPage } from "@/features/locations";
import { CampaignMembersPage } from "@/features/members";
import { CampaignMonstersPage, MonstersCatalogPage } from "@/features/monsters";
import { CampaignNotesPage } from "@/features/notes";
import { CampaignNpcsPage } from "@/features/npcs";
import { CampaignQuestsPage } from "@/features/quests";
import { SettingsPage } from "@/features/settings";
import { CampaignSessionsPage } from "@/features/sessions";
import { AppLayout } from "@/layouts/AppLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { RootLayout } from "@/layouts/RootLayout";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <AnonymousRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              {
                path: appPaths.login,
                element: <AuthPage />,
              },
              {
                path: appPaths.register,
                element: <AuthPage />,
              },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: appPaths.home,
                element: <HomePage />,
              },
              {
                path: appPaths.items,
                element: <ItemsCatalogPage />,
              },
              {
                path: appPaths.monsters,
                element: <MonstersCatalogPage />,
              },
              {
                path: appPaths.campaignOverview,
                element: <CampaignOverviewPage />,
              },
              {
                path: appPaths.campaignInventoryRoute,
                element: <CampaignInventoryPage />,
              },
              {
                path: appPaths.campaignMembersRoute,
                element: <CampaignMembersPage />,
              },
              {
                path: appPaths.campaignMonstersRoute,
                element: <CampaignMonstersPage />,
              },
              {
                path: appPaths.campaignSessionsRoute,
                element: <CampaignSessionsPage />,
              },
              {
                path: appPaths.campaignCharactersRoute,
                element: <CampaignCharactersPage />,
              },
              {
                path: appPaths.campaignQuestsRoute,
                element: <CampaignQuestsPage />,
              },
              {
                path: appPaths.campaignChronicleRoute,
                element: <CampaignChroniclePage />,
              },
              {
                path: appPaths.campaignNotesRoute,
                element: <CampaignNotesPage />,
              },
              {
                path: appPaths.campaignNpcsRoute,
                element: <CampaignNpcsPage />,
              },
              {
                path: appPaths.campaignLocationsRoute,
                element: <CampaignLocationsPage />,
              },
              {
                path: appPaths.settings,
                element: <SettingsPage />,
              },
            ],
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
