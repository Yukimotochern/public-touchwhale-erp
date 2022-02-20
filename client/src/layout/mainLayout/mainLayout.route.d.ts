import {
  // IconLookup,
  IconDefinition,
  // findIconDefinition
} from '@fortawesome/fontawesome-svg-core'

interface RouteForReactRouterDom {
  name: string
  relativeURL: string
}

interface TabRoute extends RouteForReactRouterDom {}
interface MainLayoutRoute extends RouteForReactRouterDom {
  icon?: IconDefinition
  tabRoutes?: TabRoute[]
}
export type MainLayoutRoutes = MainLayoutRoute[]
