import * as React from 'react'
import {
  createRootRoute,
  Outlet,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'

import Footer from '@/components/footer'
import { NavBar } from '@/components/nav-bar/nav-bar'
import { NavBarMobile } from '@/components/nav-bar/nav-bar-mobile'
import { ThemeProvider } from '@/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'

import { KeycloakProvider } from '#/providers/keycloak-provider'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '#/lib/query-client'

import { seo } from '#/lib/utils'

import stylesUrl from '../styles.css?url' 

import {
  ReactQueryDevtoolsPanel,
} from '@tanstack/react-query-devtools'

import {
  TanStackRouterDevtoolsPanel,
} from '@tanstack/react-router-devtools'

import { TanStackDevtools } from '@tanstack/react-devtools'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ...seo({
        title: 'MetaTrack',
        description:
          'MetaTrack is an open platform for metadata management and tracking...',
      }),
    ],
    links: [
      { rel: 'stylesheet', href: stylesUrl },
      { rel: 'icon', href: '/Metatrack-logo.svg' },
    ],
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

function LayoutComponent() {
  return (
    <>
      <header>
        <div className="lg:hidden">
          <NavBarMobile />
        </div>
        <div className="hidden lg:flex">
          <NavBar />
        </div>
      </header>

      <main className="flex-1 w-full mx-auto">
        <Outlet />
        <Toaster position="top-center" />
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
      </main>

      <Footer />
    </>
  )
}

function RootComponent() {
  return (
    <KeycloakProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <RootDocument>
            <LayoutComponent />
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
        {children}
        <Scripts />
      </body>
    </html>
  )
}