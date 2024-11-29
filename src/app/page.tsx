import { redirect } from "next/navigation";
import { Hero } from "./components/landingPage/Hero";
import { Logos } from "./components/landingPage/Logos";
import { Features } from "./components/landingPage/Features";
import { auth } from "./lib/auth";
import { CTA } from "./components/landingPage/Cta";
import { Navbar } from "./components/landingPage/navbar";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    return redirect("/dashboard");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar />
      <Hero />
      <Logos />
      <Features />
      <CTA />
    </div>
  );
}
