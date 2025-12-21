import { Header } from "@/components/header";
import { ProfileSection } from "@/components/profile-section";
import { PRList } from "@/components/pr-list";
import { prs, lastUpdated } from "@/data/prs";
import { orgs } from "@/data/orgs";

export default async function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-background to-muted/20">
      <Header />

      <main className="container mx-auto flex-1 max-w-4xl px-4 py-8">
        <ProfileSection username="sasagar" prs={prs} lastUpdated={lastUpdated} />
        <PRList prs={prs} orgs={orgs} />
      </main>

      <footer className="border-t bg-background/50 backdrop-blur py-6">
        <div className="container mx-auto max-w-4xl px-4 text-center text-sm text-muted-foreground">
          <p>Built with Waku + React</p>
        </div>
      </footer>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};
