import { GitPullRequest } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-12 max-w-4xl items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2 font-medium text-sm hover:text-primary transition-colors">
          <GitPullRequest className="h-4 w-4" />
          <span>PR List</span>
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
