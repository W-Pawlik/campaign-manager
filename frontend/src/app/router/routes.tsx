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
import { CampaignFightTrackerPage } from "@/features/fight-tracker";
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
                index: true,
                element: <HomePage />,
              },
              {
                path: "items",
                element: <ItemsCatalogPage />,
              },
              {
                path: "monsters",
                element: <MonstersCatalogPage />,
              },
              {
                path: "campaigns/:campaignId",
                element: <CampaignOverviewPage />,
              },
              {
                path: "campaigns/:campaignId/inventory",
                element: <CampaignInventoryPage />,
              },
              {
                path: "campaigns/:campaignId/fight-tracker",
                element: <CampaignFightTrackerPage />,
              },
              {
                path: "campaigns/:campaignId/members",
                element: <CampaignMembersPage />,
              },
              {
                path: "campaigns/:campaignId/monsters",
                element: <CampaignMonstersPage />,
              },
              {
                path: "campaigns/:campaignId/sessions",
                element: <CampaignSessionsPage />,
              },
              {
                path: "campaigns/:campaignId/characters",
                element: <CampaignCharactersPage />,
              },
              {
                path: "campaigns/:campaignId/quests",
                element: <CampaignQuestsPage />,
              },
              {
                path: "campaigns/:campaignId/chronicle",
                element: <CampaignChroniclePage />,
              },
              {
                path: "campaigns/:campaignId/notes",
                element: <CampaignNotesPage />,
              },
              {
                path: "campaigns/:campaignId/npcs",
                element: <CampaignNpcsPage />,
              },
              {
                path: "campaigns/:campaignId/locations",
                element: <CampaignLocationsPage />,
              },
              {
                path: "settings",
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
