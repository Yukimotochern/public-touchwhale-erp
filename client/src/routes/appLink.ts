import { RouteObject } from 'react-router-dom'
import { IconLookup } from '@fortawesome/fontawesome-svg-core'
import { TFuncKey } from 'react-i18next'

export interface RouteObjectWithoutElementWithIconAndText
  extends Omit<RouteObject, 'element'> {
  icon?: IconLookup // possible other source but need solution
  text?: TFuncKey
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
    text: 'mainLink.home.text',
    icon: { prefix: 'fas', iconName: 'house-chimney' },
  },
  {
    path: '/order',
    text: 'mainLink.order.text',
    icon: { prefix: 'fas', iconName: 'money-check-dollar' },
    children: [
      {
        path: 'process',
        text: 'mainLink.order.process.text',
      },
      {
        path: 'marketing_event',
        text: 'mainLink.order.marketing_event.text',
      },
      { path: 'ec_order', text: 'mainLink.order.ec_order.text' },
      {
        path: 'ec_correspendence',
        text: 'mainLink.order.ec_correspendence.text',
      },
      {
        path: 'ec_management',
        text: 'mainLink.order.ec_management.text',
      },
    ],
  },
  {
    path: '/item',
    text: 'mainLink.product.text',
    icon: { prefix: 'fas', iconName: 'gift' },
    children: [
      { path: 'basic', text: 'mainLink.product.basic.text' },
      {
        path: 'specification',
        text: 'mainLink.product.specification.text',
      },
      { path: 'warehouse', text: 'mainLink.product.warehouse.text' },
    ],
  },
  {
    path: '/purchase',
    text: 'mainLink.purchase.text',
    icon: { prefix: 'fas', iconName: 'cart-shopping' },
  },
  {
    path: '/datacenter',
    icon: { prefix: 'fas', iconName: 'database' },
    text: 'mainLink.datacenter.text',
    children: [
      { path: 'shopee', text: 'mainLink.datacenter.shopee.text' },
      {
        path: 'performance',
        text: 'mainLink.datacenter.performance.text',
      },
      { path: 'scrapper', text: 'mainLink.datacenter.scrapper.text' },
    ],
  },
  {
    path: '/e-invoice',
    text: 'mainLink.e-invoice.text',
    icon: { prefix: 'fas', iconName: 'receipt' },
  },
  {
    path: '/team',
    icon: { prefix: 'fas', iconName: 'users' },
    text: 'mainLink.team.text',
    children: [
      { path: 'member', text: 'mainLink.team.member.text' },
      { path: 'role', text: 'mainLink.team.role.text' },
      { path: 'activity', text: 'mainLink.team.activity.text' },
    ],
  },
  {
    path: '/account',
    text: 'mainLink.account.text',
    icon: { prefix: 'fas', iconName: 'gear' },
    children: [
      {
        path: 'profile',
        text: 'mainLink.account.profile.text',
      },
      { path: 'plan', text: 'mainLink.account.plan.text' },
    ],
  },
  {
    path: '/import',
    text: 'mainLink.import.text',
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
  },
  {
    path: '/resetPassword',
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
