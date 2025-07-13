export function error(message:string): void {
 throw new Error(`[RainRouter] [ERROR]: ${message}`);
}

export function logError(message: string): void {
  console.error(`[RainRouter] [ERROR]: ${message}`);
}

export function logWarn(message: string): void {
  console.warn(`[RainRouter] [WARN]: ${message}`);
}

export function logInfo(message: string): void {
  console.info(`[RainRouter] [INFO]: ${message}`);
}