// Keep the home route in the entry and fetch other screens only when needed.
export const publicRouteLoaders = {
  '/about': () => import('../components/About'),
  '/services': () => import('../pages/Services'),
  '/portfolio': () => import('../pages/Portfolio'),
  '/portfolio/:slug': () => import('../pages/ProjectCaseStudy'),
  '/blog': () => import('../pages/Blog'),
  '/blog/:slug': () => import('../pages/BlogArticle'),
  '/contact': () => import('../pages/Contact'),
}

export const hasConstrainedConnection = (connection) =>
  Boolean(connection?.saveData || ['slow-2g', '2g', '3g'].includes(connection?.effectiveType))

export const warmPublicRoute = (path) => {
  if (!hasConstrainedConnection(navigator.connection)) {
    publicRouteLoaders[path]?.().catch(() => {})
  }
}
