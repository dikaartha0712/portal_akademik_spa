export function getPath() {
  return location.pathname || "/";
}

export function navigate(path) {
  history.pushState({}, "", path);
  window.dispatchEvent(new Event("routechange"));
}

export function matchRoute(routes, path) {
  return routes.find(r => r.path === path) || routes.find(r => r.path === "*");
}
