import { logError, logInfo, logWarn, error } from "../helpers/logger";
import { Express } from "express";
import fs from "fs";
import path from "path";

export interface RouteDef {
  name: string;
  route: string;
  method: "get" | "post";
}

export async function rainify(
  app: Express,
  options: {
    routeFolder: string;
    manageFile: string;
  }
) {
  const managePath = path.resolve(options.manageFile);

  let routes: RouteDef[];
  try {
    routes = JSON.parse(fs.readFileSync(managePath, "utf-8"));
  } catch (err) {
    logError(`Failed to read or parse manage file: ${managePath}`);
    throw err;
  }

  for (const route of routes) {
    const filePath = path.join(
      path.resolve(options.routeFolder),
      `${route.name}.ts`
    );

    if (!fs.existsSync(filePath)) {
      logWarn(`Route file not found: ${filePath}`);
      continue;
    }

    let routeModule;
    try {
      routeModule = await import(filePath);
    } catch (err) {
      logError(`Failed to import route module: ${filePath}`);
      continue;
    }

    const handler = routeModule.default?.run;

    if (typeof handler !== "function") {
      logWarn(`'run' function not found or invalid in ${route.name}.ts`);
      continue;
    }

    switch (route.method.toLowerCase()) {
      case "get":
        app.get(route.route, handler);
        break;
      case "post":
        app.post(route.route, handler);
        break;
      default:
        logWarn(`Unsupported HTTP method: ${route.method}`);
        continue;
    }

    logInfo(`Route loaded: [${route.method.toUpperCase()}] ${route.route}`);
  }
}
