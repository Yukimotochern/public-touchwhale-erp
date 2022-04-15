import React from 'react'
import { RouteObject, Outlet } from 'react-router-dom'
import { MainLayout } from '../layout/mainLayout/MainLayout'
import { HomePage } from '../pages/home/HomePage'
import { PageWithHeader } from '../layout/mainLayout/pageWithHeader/PageWithHeader'
import { FullLayout } from '../layout/fullLayout/FullLayout'
import { SignUpPage } from '../pages/signUp/SignUpPage'
import { SignInPage } from '../pages/signIn/SignInPage'
import { PrivateOutlet } from '../components/private/PrivateOutlet'
import { PublicOutlet } from '../components/public/PublicOutlet'
import { ProfilePage } from '../pages/profile/ProfilePage'
import { ForgetPasswordPage } from '../pages/forgetPassword/ForgetPasswordPage'
import { ResetPasswordPage } from '../pages/resetPassword/ResetPasswordPage'
import { ProductPageTable } from '../pages/product/ProductPage'
import { Table } from '../components/interviewHomework/Table'

// ! make sure applink is sync with this one
import _ from 'lodash'
import {
  fullRouteSpecification as fullRouteSpecificationFromLink,
  RouteObjectWithoutElementWithIconAndText,
} from './appLink'
// !

/**
 * ! Update appLink.ts if any of below routes modified
 */
export const mainLayoutRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/order',
    element: (
      <PageWithHeader title='order_page.title'>
        <Outlet />
      </PageWithHeader>
    ),
    children: [
      {
        path: 'process',
        element: <Table />,
      },
      {
        path: 'marketing_event',
        element: <h1>Marking Event Tab</h1>,
      },
      { path: 'ec_order', element: <h1>EC Order Tab</h1> },
      {
        path: 'ec_correspendence',
        element: <h1>EC Correspendence Tab</h1>,
      },
      {
        path: 'ec_management',
        element: <h1>EC Management Tab</h1>,
      },
    ],
  },
  {
    path: '/item',
    element: (
      <PageWithHeader title='item_page.title'>
        <Outlet />
      </PageWithHeader>
    ),
    children: [
      { path: 'basic', element: <ProductPageTable /> },
      {
        path: 'specification',
        element: <h1>Specification Tab</h1>,
      },
      { path: 'warehouse', element: <h1>Warehouse Tab</h1> },
    ],
  },
  {
    path: '/purchase',
    element: (
      <PageWithHeader title='purchase_page.title'>
        <Outlet />
      </PageWithHeader>
    ),
  },
  {
    path: '/datacenter',
    element: (
      <PageWithHeader title='datacenter_page.title'>
        <Outlet />
      </PageWithHeader>
    ),
    children: [
      { path: 'shopee', element: <h1>Shopee Tab</h1> },
      {
        path: 'performance',
        element: <h1>Performance Tab</h1>,
      },
      { path: 'scrapper', element: <h1>Scrapper Tab</h1> },
    ],
  },
  {
    path: '/e-invoice',
    element: (
      <PageWithHeader title='e-invoice_page.title'>
        <Outlet />
      </PageWithHeader>
    ),
  },
  {
    path: '/team',
    element: (
      <PageWithHeader title='team_page.title'>
        <Outlet />
      </PageWithHeader>
    ),
    children: [
      { path: 'member', element: <h1>Member Tab</h1> },
      { path: 'role', element: <h1>Role Tab</h1> },
      { path: 'activity', element: <h1>Activity Tab</h1> },
    ],
  },
  {
    path: '/account',
    element: (
      <PageWithHeader title='setting_page.title' yScroll>
        <Outlet />
      </PageWithHeader>
    ),
    children: [
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      { path: 'plan', element: <h1>Plan Page</h1> },
    ],
  },
  {
    path: '/import',
    element: (
      <PageWithHeader title='import_page.title'>
        <Outlet />
      </PageWithHeader>
    ),
  },
]
const fullLayoutRoutes: RouteObject[] = [
  {
    path: 'signUp',
    element: <SignUpPage />,
  },
  {
    path: 'signIn',
    element: <SignInPage />,
  },
  {
    path: '/forgetPassword',
    element: <ForgetPasswordPage />,
  },
  {
    path: '/resetPassword',
    element: <ResetPasswordPage />,
  },
]

const fullRouteSpecification: RouteObject[] = [
  {
    element: <PrivateOutlet />,
    children: [
      {
        element: <MainLayout />,
        children: mainLayoutRoutes,
      },
    ],
  },
  {
    element: <PublicOutlet />,
    children: [
      {
        element: <FullLayout />,
        children: fullLayoutRoutes,
      },
    ],
  },
]

export const appRoutes = fullRouteSpecification

if (process.env.NODE_ENV === 'development') {
  /**
   * ! the fullRouteSpecificationFromLink should delete icon, text
   * ! the fullRouteSpecification should delete element
   * ! then, they should equal to each other
   */
  interface RouteObjectWithoutElement extends Omit<RouteObject, 'element'> {}
  const deleteIconAndText = (
    routes: RouteObjectWithoutElementWithIconAndText[]
  ): RouteObjectWithoutElement[] => {
    return routes.map((route) => {
      const routeShouldDeletedThings = {
        ...route,
      }
      delete routeShouldDeletedThings.icon
      delete routeShouldDeletedThings.text
      return {
        ...routeShouldDeletedThings,
        children: route.children
          ? deleteIconAndText(route.children)
          : undefined,
      }
    })
  }
  const deleteElement = (
    routes: RouteObject[]
  ): RouteObjectWithoutElement[] => {
    return routes.map((route) => {
      const routeShouldDeletedThings = {
        ...route,
      }
      delete routeShouldDeletedThings.element
      return {
        ...routeShouldDeletedThings,
        children: route.children ? deleteElement(route.children) : undefined,
      }
    })
  }
  const fullHere = deleteElement(fullRouteSpecification)
  const fullInLink = deleteIconAndText(fullRouteSpecificationFromLink)
  // Use the '.isEqual' from lodash package to deep compare
  if (!_.isEqual(fullHere, fullInLink)) {
    console.log(fullHere)
    console.log(fullInLink)
    throw new Error(
      'Please make sure that fullRouteSpecification has exactly the same structure between AppRoutes.tsx and appLink.ts. The order DO matter.'
    )
  }
}
