"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Container from "@/components/Container";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // stop clicking many times

  async function handleSubmit(
    e: React.SyntheticEvent<HTMLFormElement>
  ) {
    e.preventDefault(); // dont reload page
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      // hit the login endpoint
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed"); // show error from server
        setLoading(false);
        return;
      }

      router.push("/dashboard"); // login success, go to home
    } catch {
      setError("Something went wrong. Please try again."); // network dead or server down
      setLoading(false);
    }
  }

  return (
    <Container>
      <div className="mx-auto max-w-sm">
        <Card>
          <PageHeader
            title="Welcome back"
            subtitle="Login in to your dashboard"
          />

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* only show red text if error exist */}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              disabled={loading} // kill button while waiting for server
              className="w-full"
            >
              {loading ? "Logging in..." : "Login in"}
            </Button>
          </form>
        </Card>
      </div>
    </Container>
  );
}
