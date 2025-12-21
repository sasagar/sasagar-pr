import { Github, GitPullRequest, GitMerge, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { PullRequest } from "@/lib/types";

interface ProfileSectionProps {
  username: string;
  prs: PullRequest[];
  lastUpdated: string;
}

export function ProfileSection({ username, prs, lastUpdated }: ProfileSectionProps) {
  const stats = {
    total: prs.length,
    open: prs.filter((pr) => pr.state === "open").length,
    merged: prs.filter((pr) => pr.state === "merged").length,
    closed: prs.filter((pr) => pr.state === "closed").length,
  };

  const formatDate = (dateString: string) => {
    // JST形式の文字列（例: "2025-12-22 02:15:30"）をそのまま表示
    return dateString;
  };

  return (
    <div className="mb-8">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <img
            src={`https://github.com/${username}.png`}
            alt={username}
            className="w-24 h-24 rounded-full border-4 border-background shadow-lg group-hover:scale-105 transition-transform"
          />
        </a>
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold mb-1">
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors inline-flex items-center gap-2"
            >
              {username}
              <Github className="h-6 w-6" />
            </a>
          </h1>
          <p className="text-muted-foreground">
            Pull Requests across Open Source Projects
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Last updated: {formatDate(lastUpdated)}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-linear-to-br from-background to-muted/50 hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <GitPullRequest className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
            <p className="text-sm text-muted-foreground">Total PRs</p>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-background to-pr-open/10 hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <GitPullRequest className="h-5 w-5 text-pr-open" />
              <span className="text-2xl font-bold text-pr-open">{stats.open}</span>
            </div>
            <p className="text-sm text-muted-foreground">Open</p>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-background to-pr-merged/10 hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <GitMerge className="h-5 w-5 text-pr-merged" />
              <span className="text-2xl font-bold text-pr-merged">{stats.merged}</span>
            </div>
            <p className="text-sm text-muted-foreground">Merged</p>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-background to-pr-closed/10 hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <XCircle className="h-5 w-5 text-pr-closed" />
              <span className="text-2xl font-bold text-pr-closed">{stats.closed}</span>
            </div>
            <p className="text-sm text-muted-foreground">Closed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
