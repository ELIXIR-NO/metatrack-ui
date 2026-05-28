import * as React from 'react'
import {
  createRootRoute,
  Outlet,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'

import { TanStackDevtools } from '@tanstack/react-devtools'

import Footer from '@/components/footer'
import { NavBar } from '@/components/nav-bar/nav-bar'
import { NavBarMobile } from '@/components/nav-bar/nav-bar-mobile'
import { ThemeProvider } from '@/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'

import '../styles.css'
import { KeycloakProvider } from '#/providers/keycloak-provider'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '#/lib/query-client'
import { seo } from '#/lib/utils'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ...seo({
        title: 'MetaTrack',
        description: `MetaTrack is an open platform for metadata management and tracking, designed to empower life scientists in Norway. It provides a comprehensive solution for organizing, managing, and tracking metadata associated with scientific research projects, ensuring data integrity and facilitating collaboration among researchers.`,
      }),
    ],
    links: [{ rel: 'icon', href: '/Metatrack-logo.svg' }],
  }),

  component: RootComponent,

  errorComponent: ({ error }) => (
    <RootDocument>
      <div className="p-4 text-red-500">{error.message}</div>
    </RootDocument>
  ),

  notFoundComponent: () => (
    <RootDocument>
      <div>Not found</div>
    </RootDocument>
  ),
})

function RootComponent() {
  return (
    <KeycloakProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <RootDocument>
            <Outlet />
          </RootDocument>
        </ThemeProvider>
      </QueryClientProvider>
    </KeycloakProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>

      <body className="min-h-screen flex flex-col">
        <header>
          <div className="lg:hidden">
            <NavBarMobile />
          </div>
          <div className="hidden lg:flex">
            <NavBar />
          </div>
        </header>

        <main className="flex-1 w-full mx-auto">
          {children}
          <Toaster position="top-center" />
        </main>

        <Footer />

        <TanStackDevtools
          plugins={[
            {
              name: 'TanStack Query',
              render: <ReactQueryDevtoolsPanel />,
            },
            {
              name: 'TanStack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
