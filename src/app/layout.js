import "@/src/app/styles.css";
import Header from "@/src/components/Header.jsx";
import { AuthProvider } from "../contexts/AuthContext";
import { getAuthenticatedAppForUser } from "../lib/firebase/serverApp";
import { getOrCreateDbUser } from "../lib/db/auth";
// Force next.js to treat this route as server-side rendered
// Without this line, during the build process, next.js will treat this route as static and build a static HTML file for it
export const dynamic = "force-dynamic";

export const metadata = {
  title: "FriendlyEats",
  description:
    "FriendlyEats is a restaurant review website built with Next.js and Firebase.",
};

export default async function RootLayout({ children }) {
  const { currentUser: firebaseUser } = await getAuthenticatedAppForUser();
  let dbUser = null;

  if (firebaseUser) {
    dbUser = await getOrCreateDbUser(firebaseUser.uid, firebaseUser.email);
  }

  return (
    <html lang="en">
      <body>
        <main>
          <AuthProvider initialUser={dbUser}>
            <Header />

            {children}
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}
