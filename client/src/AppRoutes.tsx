import React from 'react'
import { RouteObject, Outlet } from 'react-router-dom'
import { MainLayout } from './layout/mainLayout/MainLayout'
import { HomePage } from './pages/home/HomePage'
import { IconLookup } from '@fortawesome/fontawesome-svg-core'

// Specify the Complete Route structure
// Then, cast to RouteObject for react-router-dom to deal with routing-related element rendering
// Also, cast to PureRouteObject for redux to deal with links-related rendering

interface RouteObjectWithLinkSpecification extends RouteObject {
  icon?: IconLookup // possible other source but need solution
  text?: string
  children?: RouteObjectWithLinkSpecification[]
}

const mainLayoutRoutes: RouteObjectWithLinkSpecification[] = [
  {
    path: '/',
    element: <HomePage />,
    text: 'Home',
    icon: { prefix: 'fas', iconName: 'house-chimney' },
  },
  {
    path: '/order',
    text: 'Order',
    element: <Outlet />,
    icon: { prefix: 'fas', iconName: 'money-check-dollar' },
    children: [
      {
        path: 'process',
        element: <h1>Process Tab</h1>,
        text: 'Order Processing',
      },
      {
        path: 'marketing_event',
        element: <h1>Marking Event Tab</h1>,
        text: 'Marking Event',
      },
      { path: 'ec_order', element: <h1>EC Order Tab</h1>, text: 'EC Order' },
      {
        path: 'ec_correspendence',
        element: <h1>EC Correspendence Tab</h1>,
        text: 'EC Correspondence',
      },
      {
        path: 'ec_management',
        element: <h1>EC Management Tab</h1>,
        text: 'EC Management',
      },
    ],
  },
  {
    path: '/item',
    element: <Outlet />,
    text: 'Product',
    icon: { prefix: 'fas', iconName: 'gift' },
    children: [
      { path: 'basic', element: <h1>Basic Tab</h1>, text: 'Basic Info' },
      {
        path: 'specification',
        element: <h1>Specification Tab</h1>,
        text: 'Specification',
      },
      { path: 'warehouse', element: <h1>Warehouse Tab</h1>, text: 'Warehouse' },
    ],
  },
  {
    path: '/purchase',
    text: 'Purchasing',
    icon: { prefix: 'fas', iconName: 'cart-shopping' },
    element: (
      <>
        <h1>Purchase Page</h1>
        <Outlet />
      </>
    ),
  },
  {
    path: '/datacenter',
    element: <Outlet />,
    icon: { prefix: 'fas', iconName: 'database' },
    text: 'Data Center',
    children: [
      { path: 'shoppee', element: <h1>Shoppee Tab</h1>, text: 'Shopee' },
      {
        path: 'performance',
        element: <h1>Performance Tab</h1>,
        text: 'Performance',
      },
      { path: 'scrapper', element: <h1>Scrapper Tab</h1>, text: 'scrapper' },
    ],
  },
  {
    path: '/e-invoice',
    text: 'E-invoice',
    icon: { prefix: 'fas', iconName: 'receipt' },
    element: (
      <>
        <h1>E-invoice Page</h1>
        <Outlet />
      </>
    ),
  },
  {
    path: '/team',
    element: <Outlet />,
    icon: { prefix: 'fas', iconName: 'users' },
    text: 'My Team',
    children: [
      { path: 'member', element: <h1>Member Tab</h1>, text: 'Member' },
      { path: 'role', element: <h1>Role Tab</h1>, text: 'Role' },
      { path: 'activity', element: <h1>Activity Tab</h1>, text: 'Activity' },
    ],
  },
  {
    path: '/account',
    text: 'My Account',
    icon: { prefix: 'fas', iconName: 'circle-user' },
    element: (
      <>
        <h1>Account Page</h1>
        <Outlet />
      </>
    ),
  },
  {
    path: '/import',
    text: 'Import',
    icon: { prefix: 'fas', iconName: 'file-import' },
    element: (
      <>
        <h1>Import Page</h1>
        <Outlet />
      </>
    ),
  },
  {
    path: '/aa',
    text: 'text',
    element: (
      <>
        <h1>aa</h1>
        <Outlet />
      </>
    ),
  },
]

const fullRouteSpecification: RouteObjectWithLinkSpecification[] = [
  {
    element: <MainLayout />,
    children: mainLayoutRoutes,
  },
]

interface PureRouteObject
  extends Omit<RouteObjectWithLinkSpecification, 'element'> {
  children?: PureRouteObject[]
  path: string
}

// Remove all the elements which is not suitable to be part of redux state
// Spread routes that don't has path properities
// Add the default links
function purifyForRedux(
  routes: RouteObjectWithLinkSpecification[]
): PureRouteObject[] {
  return routes.reduce<PureRouteObject[]>((pre, curr): PureRouteObject[] => {
    let withOutElement = {
      ...curr,
    }
    delete withOutElement.element
    if (withOutElement.path || withOutElement.index) {
      return pre.concat([
        {
          ...withOutElement,
          path: withOutElement.path || '/',
          children: withOutElement.children
            ? purifyForRedux(withOutElement.children)
            : undefined,
        },
      ])
    } else if (!!withOutElement.children) {
      return pre.concat(purifyForRedux(withOutElement.children))
    } else {
      return pre
    }
  }, [])
}

function deleteOtherthanRouteObject(
  routes: RouteObjectWithLinkSpecification[]
): RouteObject[] {
  return routes.map((route) => ({
    ...route,
    icon: undefined,
    text: undefined,
    children: route.children
      ? deleteOtherthanRouteObject(route.children)
      : undefined,
  }))
}

// pureAppRoutes will be used by some route-related slices as reference for the whole routing structure
const pureAppRoutes: PureRouteObject[] = purifyForRedux(fullRouteSpecification)
const appRoutes = deleteOtherthanRouteObject(fullRouteSpecification)

export { pureAppRoutes, appRoutes }
