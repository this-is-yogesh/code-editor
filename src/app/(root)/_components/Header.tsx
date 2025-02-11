
import { currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const Header = async () => {
  const clerkuser = await currentUser();
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const convexUser = await convex.query(api.users.getUser, {
    userId: clerkuser?.id || "",
  });

  console.log({ convexUser });

  return <div>Header</div>;
};

export default Header
