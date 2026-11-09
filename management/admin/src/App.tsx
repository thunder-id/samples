// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {ProtectedRoute} from '@thunderid/react-router';
import type {ReactElement} from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router';
import Nav from './components/Nav';
import Shell from './components/Shell';
import AccountPage from './pages/AccountPage';
import AgentPage from './pages/AgentPage';
import AgentsPage from './pages/AgentsPage';
import ApplicationPage from './pages/ApplicationPage';
import ApplicationsPage from './pages/ApplicationsPage';
import CreateAgentPage from './pages/CreateAgentPage';
import CreateApplicationPage from './pages/CreateApplicationPage';
import CreateGroupPage from './pages/CreateGroupPage';
import CreateOrganizationUnitPage from './pages/CreateOrganizationUnitPage';
import CreateProjectPage from './pages/CreateProjectPage';
import CreateRolePage from './pages/CreateRolePage';
import CreateUserPage from './pages/CreateUserPage';
import FlowPage from './pages/FlowPage';
import FlowsPage from './pages/FlowsPage';
import GroupPage from './pages/GroupPage';
import GroupsPage from './pages/GroupsPage';
import HomePage from './pages/HomePage';
import OnboardAgentPage from './pages/OnboardAgentPage';
import OrganizationUnitPage from './pages/OrganizationUnitPage';
import OrganizationUnitsPage from './pages/OrganizationUnitsPage';
import ProjectPage from './pages/ProjectPage';
import ProjectsPage from './pages/ProjectsPage';
import RolePage from './pages/RolePage';
import RolesPage from './pages/RolesPage';
import UserPage from './pages/UserPage';
import UsersPage from './pages/UsersPage';
import './App.css';

const router = createBrowserRouter([
  {
    element: <Nav />,
    children: [
      {path: '/', element: <HomePage />},
      {
        element: (
          <ProtectedRoute>
            <Shell />
          </ProtectedRoute>
        ),
        children: [
          {path: '/users', element: <UsersPage />},
          {path: '/users/new', element: <CreateUserPage />},
          {path: '/users/:id', element: <UserPage />},
          {path: '/groups', element: <GroupsPage />},
          {path: '/groups/new', element: <CreateGroupPage />},
          {path: '/groups/:id', element: <GroupPage />},
          {path: '/roles', element: <RolesPage />},
          {path: '/roles/new', element: <CreateRolePage />},
          {path: '/roles/:id', element: <RolePage />},
          {path: '/applications', element: <ApplicationsPage />},
          {path: '/applications/new', element: <CreateApplicationPage />},
          {path: '/applications/:id', element: <ApplicationPage />},
          {path: '/agents', element: <AgentsPage />},
          {path: '/agents/new', element: <CreateAgentPage />},
          {path: '/agents/onboard', element: <OnboardAgentPage />},
          {path: '/agents/:id', element: <AgentPage />},
          {path: '/flows', element: <FlowsPage />},
          {path: '/flows/:id', element: <FlowPage />},
          {path: '/projects', element: <ProjectsPage />},
          {path: '/projects/new', element: <CreateProjectPage />},
          {path: '/projects/:id', element: <ProjectPage />},
          {path: '/organization-units', element: <OrganizationUnitsPage />},
          {path: '/organization-units/new', element: <CreateOrganizationUnitPage />},
          {path: '/organization-units/:id', element: <OrganizationUnitPage />},
          {path: '/account', element: <AccountPage />},
        ],
      },
    ],
  },
]);

export default function App(): ReactElement {
  return <RouterProvider router={router} />;
}
