import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/icons";

export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 sm:p-6">
        <Logo />
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <div className="max-w-3xl">
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Smarter, Faster, Explainable Transaction Categorization
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            FinWiseAI provides a next-generation, in-house AI engine to
            autonomously classify financial data with unparalleled accuracy and
            transparency.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/register">
                Get Started <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <footer className="p-4 sm:p-6 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} FinWiseAI. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
