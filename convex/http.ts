import { httpRouter } from "convex/server";
import { POSTRequestFromClerk } from "./httpActions";

const http = httpRouter();
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: POSTRequestFromClerk,
});

export default http;
