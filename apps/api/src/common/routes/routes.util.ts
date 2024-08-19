import { Routes } from '@nestjs/core';

// Util for returning module dependencies
export function getAllRouteModules(routes: Routes, modules: Array<any>) {
  routes.map((route) => {
    if (route.children && route.children.length > 0) {
      return getAllRouteModules(route.children as any, modules);
    }

    modules.push(route.module);
  });

  return modules;
}

export function getSpecificRouteModules(
  routes: Routes,
  rootPath: string,
  modules: Array<any>,
) {
  routes.map((route) => {
    if (
      route.children &&
      route.children.length > 0 &&
      route.path === rootPath
    ) {
      route.children.forEach((route: any) => {
        modules.push(route.module);
      });
    }
  });

  return modules;
}
