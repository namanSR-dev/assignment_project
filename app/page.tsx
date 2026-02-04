import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const cookiesStore = await cookies()
  const token = cookiesStore.get("token");

  if (token) {
    redirect("/dashboard");
  }

  redirect("/login");
}
