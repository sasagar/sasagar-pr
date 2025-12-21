import { GitPullRequest, GitMerge, XCircle, MessageSquare, FileCode } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PullRequest } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

interface PRCardProps {
  pr: PullRequest;
}

function StatusIcon({ status }: { status: PullRequest["state"] }) {
  switch (status) {
    case "open":
      return <GitPullRequest className="h-5 w-5 text-pr-open" />;
    case "merged":
      return <GitMerge className="h-5 w-5 text-pr-merged" />;
    case "closed":
      return <XCircle className="h-5 w-5 text-pr-closed" />;
  }
}

function StatusBorderClass(status: PullRequest["state"]) {
  switch (status) {
    case "open":
      return "border-l-pr-open";
    case "merged":
      return "border-l-pr-merged";
    case "closed":
      return "border-l-pr-closed";
  }
}

export function PRCard({ pr }: PRCardProps) {
  const badgeVariant = pr.isDraft
    ? "outline"
    : pr.state === "open"
      ? "open"
      : pr.state === "merged"
        ? "merged"
        : "closed";

  return (
    <Card className={`group border-l-4 ${StatusBorderClass(pr.state)} hover:shadow-lg hover:scale-[1.01] transition-all duration-200`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Repository Avatar */}
          <a
            href={pr.repository.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <img
              src={`https://github.com/${pr.repository.owner}.png`}
              alt={pr.repository.owner}
              className="w-10 h-10 rounded-lg border bg-muted"
            />
          </a>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title Row */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                <a href={pr.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {pr.title}
                </a>
              </h3>
              <Badge variant={badgeVariant} className="shrink-0 text-xs">
                {pr.isDraft ? "Draft" : pr.state}
              </Badge>
            </div>

            {/* Repository Info */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <a
                href={pr.repository.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-foreground transition-colors"
              >
                {pr.repository.owner}/{pr.repository.name}
              </a>
              <span className="opacity-60">#{pr.number}</span>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <StatusIcon status={pr.state} />
                <span>{formatRelativeTime(pr.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileCode className="h-3.5 w-3.5" />
                <span>{pr.changedFiles}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-green-600 dark:text-green-400 font-medium">+{pr.additions}</span>
                <span className="text-red-600 dark:text-red-400 font-medium">-{pr.deletions}</span>
              </div>
              {pr.comments > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>{pr.comments}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
