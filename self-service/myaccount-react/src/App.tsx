// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {ProtectedRoute} from '@thunderid/react-router';
import type {ReactElement} from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router';
import Nav from './components/Nav';
import AccountPage from './pages/AccountPage';
import HomePage from './pages/HomePage';
import './App.css';

const router = createBrowserRouter([
  {
    element: <Nav />,
    children: [
      {path: '/', element: <HomePage />},
      {
        path: '/account',
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default function App(): ReactElement {
  return <RouterProvider router={router} />;
}
