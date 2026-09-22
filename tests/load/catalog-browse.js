import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 5,
  duration: "30s",
};

export default function () {
  const response = http.get(`${__ENV.BASE_URL || "http://localhost:3000"}/ar/products`);
  check(response, { "catalog status is 200": (r) => r.status === 200 });
  sleep(1);
}
