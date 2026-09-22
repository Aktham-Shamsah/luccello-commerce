export function GET() {
  return Response.json({
    version: process.env.VERSION ?? "0.1.0-local-ready",
    gitSha: process.env.GIT_SHA ?? "local",
    environment: process.env.APP_ENV ?? "local",
  });
}
