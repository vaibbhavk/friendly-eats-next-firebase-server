"use client";

import { useAuth } from "@/src/contexts/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return <h1>Database user: {user ? user.phone_number : "Login kar"}</h1>;
}
