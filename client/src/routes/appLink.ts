import { RouteObject } from 'react-router-dom'
import { IconLookup } from '@fortawesome/fontawesome-svg-core'

export interface RouteObjectWithoutElementWithIconAndText
  extends Omit<RouteObject, 'element'> {
  icon?: IconLookup // possible other source but need solution
  text?: string
  children?: RouteObjectWithoutElementWithIconAndText[]
}

export interface RouteRequirePath
  extends RouteObjectWithoutElementWithIconAndText {
  path: string
  children?: RouteRequirePath[]
}

export interface RouteLink extends RouteRequirePath {
  link: string[]
  children?: RouteLink[]
}

export const mainLayoutRoutes: RouteObjectWithoutElementWithIconAndText[] = [
  {
    path: '/',
    text: 'Home',
    icon: { prefix: 'fas', iconName: 'house-chimney' },
  },
  {
    path: '/order',
    text: 'Order',
    icon: { prefix: 'fas', iconName: 'money-check-dollar' },
    children: [
      {
        path: 'process',
        text: 'Order Processing',
      },
      {
        path: 'marketing_event',
        text: 'Marking Event',
      },
      { path: 'ec_order', text: 'EC Order' },
      {
        path: 'ec_correspendence',
        text: 'EC Correspondence',
      },
      {
        path: 'ec_management',
        text: 'EC Management',
      },
    ],
  },
  {
    path: '/item',
    text: 'Product',
    icon: { prefix: 'fas', iconName: 'gift' },
    children: [
      { path: 'basic', text: 'Basic' },
      {
        path: 'specification',
        text: 'Specification',
      },
      { path: 'warehouse', text: 'Warehouse' },
    ],
  },
  {
    path: '/purchase',
    text: 'Purchasing',
    icon: { prefix: 'fas', iconName: 'cart-shopping' },
  },
  {
    path: '/datacenter',
    icon: { prefix: 'fas', iconName: 'database' },
    text: 'Data Center',
    children: [
      { path: 'shoppee', text: 'Shopee' },
      {
        path: 'performance',
        text: 'Performance',
      },
      { path: 'scrapper', text: 'Scrapper' },
    ],
  },
  {
    path: '/e-invoice',
    text: 'E-invoice',
    icon: { prefix: 'fas', iconName: 'receipt' },
  },
  {
    path: '/team',
    icon: { prefix: 'fas', iconName: 'users' },
    text: 'My Team',
    children: [
      { path: 'member', text: 'Member' },
      { path: 'role', text: 'Role' },
      { path: 'activity', text: 'Activity' },
    ],
  },
  {
    path: '/account',
    text: 'Setting',
    icon: { prefix: 'fas', iconName: 'gear' },
    children: [
      {
        path: 'profile',
        text: 'Profile & Account',
      },
      { path: 'plan', text: 'Plan' },
    ],
  },
  {
    path: '/import',
    text: 'Import',
    icon: { prefix: 'fas', iconName: 'file-import' },
  },
]
export const fullLayoutRoutes: RouteObjectWithoutElementWithIconAndText[] = [
  {
    path: 'signUp',
  },
  {
    path: 'signIn',
  },
  {
    path: '/forgetPassword',
    children: [
      {
        path: ':forgetPasswordToken',
      },
    ],
  },
]

export const fullRouteSpecification: RouteObjectWithoutElementWithIconAndText[] =
  [
    {
      children: [
        {
          children: mainLayoutRoutes,
        },
      ],
    },
    {
      children: [
        {
          children: fullLayoutRoutes,
        },
      ],
    },
  ]

// flatter those without path
// remove those without path and children
function flatterNoPathRoute(
  routes: RouteObjectWithoutElementWithIconAndText[]
): RouteRequirePath[] {
  return routes.reduce<RouteRequirePath[]>((pre, curr): RouteRequirePath[] => {
    if (curr.path || curr.index) {
      return pre.concat([
        {
          ...curr,
          path: curr.path?.replace('/', '') || '',
          children: curr.children
            ? flatterNoPathRoute(curr.children)
            : undefined,
        },
      ])
    } else if (!!curr.children) {
      return pre.concat(flatterNoPathRoute(curr.children))
    } else {
      return pre
    }
  }, [])
}

// set default link to link
function setLink(
  routesRequirePath: RouteRequirePath[],
  outterLink: string[]
): { routeLinks: RouteLink[]; innerLink: string[] } {
  let innerLink: string[] = []
  if (routesRequirePath.length === 0) {
    return {
      routeLinks: [],
      innerLink: [],
    }
  } else {
    const routeLinks = routesRequirePath.map<RouteLink>((route, ind) => {
      let { routeLinks, innerLink: deeperLink } = setLink(
        route.children || [],
        outterLink.concat([route.path])
      )
      if (ind === 0) {
        innerLink = [route.path].concat(deeperLink)
      }
      return {
        ...route,
        link: outterLink.concat([route.path]).concat(deeperLink),
        children: routeLinks,
      }
    })
    return {
      innerLink,
      routeLinks,
    }
  }
}

export const { routeLinks: mainRouteLinks } = setLink(
  flatterNoPathRoute(mainLayoutRoutes),
  []
)
