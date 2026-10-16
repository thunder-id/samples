// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {ProtectedRoute} from '@thunderid/react-router';
import type {ReactElement} from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router';
import Nav from './components/Nav';
import Shell from './components/Shell';
import AgentsPage from './pages/AgentsPage';
import CreateAgentPage from './pages/CreateAgentPage';
import HomePage from './pages/HomePage';
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
          {path: '/agents', element: <AgentsPage />},
          {path: '/agents/new', element: <CreateAgentPage />},
        ],
      },
    ],
  },
]);

export default function App(): ReactElement {
  return <RouterProvider router={router} />;
}
