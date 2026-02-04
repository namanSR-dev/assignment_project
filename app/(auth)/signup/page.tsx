"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Container from "@/components/Container";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // stop clicking button 100 times

  async function handleSubmit(
    e: React.SyntheticEvent<HTMLFormElement>
  ) {
    e.preventDefault(); // stop page refresh
    setError("");
    setLoading(true);

    // fast check before sending to server
    if (!name || !email || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      // call our signup api
      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed"); // show what server say
        setLoading(false);
        return;
      }

      router.push("/dashboard"); // everything good, go to home
    } catch {
      setError("Something went wrong. Please try again."); // if internet or server die
      setLoading(false);
    }
  }

  return (
    <Container>
      <div className="mx-auto max-w-sm">
        <Card>
          <PageHeader
            title="Create an account"
            subtitle="Get started in under a minute"
          />

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* only show red text if error exist */}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <Input
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)} // save name to state
            />

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
              disabled={loading} // button dead while waiting
              className="w-full"
            >
              {loading ? "Creating account..." : "Sign up"}
            </Button>
          </form>
        </Card>
      </div>
    </Container>
  );
}
