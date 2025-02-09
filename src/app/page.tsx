"use client"
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";

function App() {
  return (
    <main>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
      <Authenticated>
        <UserButton />
        {/* <Content /> */}
      </Authenticated>
    </main>
  );
}

// function Content() {
//   const messages = useQuery(api.messages.getForCurrentUser);
//   return <div>Authenticated content: {messages?.length}</div>;
// }
export default App;
