"use client";
import React from "react";
import Link from "next/link";
import { addFakeRestaurantsAndReviews } from "@/src/lib/firebase/firestore.js";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, signInWithGoogle, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = (event) => {
    event.preventDefault();
    signOut();
    router.push("/");
  };

  const handleSignIn = (event) => {
    event.preventDefault();
    signInWithGoogle();
  };

  return (
    <header>
      <Link href="/" className="logo">
        <img src="/friendly-eats.svg" alt="FriendlyEats" />
        Friendly Eats
      </Link>

      <Link href="/profile" className="logo">
        Profile
      </Link>

      <Link href="/notp" className="logo">
        Not Protected
      </Link>
      {user ? (
        <>
          <div className="profile">
            <p>{user.phone_number}</p>

            <div className="menu">
              ...
              <ul>
                <li>{user.phone_number}</li>

                <li>
                  <a href="#" onClick={addFakeRestaurantsAndReviews}>
                    Add sample restaurants
                  </a>
                </li>

                <li>
                  <a href="#" onClick={handleSignOut}>
                    Sign Out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="profile">
          <a href="#" onClick={handleSignIn}>
            <img src="/profile.svg" alt="A placeholder user image" />
            Sign In with Google
          </a>
        </div>
      )}
    </header>
  );
}
