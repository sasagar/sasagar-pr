import { Octokit } from "octokit";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { generateOGPImage } from "./generate-ogp.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface PullRequest {
  id: string;
  number: number;
  title: string;
  url: string;
  state: "open" | "merged" | "closed";
  createdAt: string;
  updatedAt: string;
  mergedAt: string | null;
  closedAt: string | null;
  repository: {
    name: string;
    owner: string;
    url: string;
  };
  additions: number;
  deletions: number;
  changedFiles: number;
  comments: number;
  isDraft: boolean;
}

interface Organization {
  name: string;
  avatarUrl: string;
  prCount: number;
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = "sasagar";

async function fetchAllPRs(): Promise<{
  prs: PullRequest[];
  orgs: Organization[];
}> {
  const octokit = new Octokit({ auth: GITHUB_TOKEN });

  const query = `
    query($cursor: String) {
      search(
        query: "is:pr author:${USERNAME}"
        type: ISSUE
        first: 100
        after: $cursor
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ... on PullRequest {
            id
            number
            title
            url
            state
            createdAt
            updatedAt
            mergedAt
            closedAt
            isDraft
            additions
            deletions
            changedFiles
            comments {
              totalCount
            }
            repository {
              name
              owner {
                login
                avatarUrl
              }
              url
            }
          }
        }
      }
    }
  `;

  const allPRs: PullRequest[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  console.log(`Fetching PRs for ${USERNAME}...`);

  while (hasNextPage) {
    const response = (await octokit.graphql(query, { cursor })) as {
      search: {
        pageInfo: { hasNextPage: boolean; endCursor: string };
        nodes: Array<{
          id: string;
          number: number;
          title: string;
          url: string;
          state: "OPEN" | "CLOSED" | "MERGED";
          createdAt: string;
          updatedAt: string;
          mergedAt: string | null;
          closedAt: string | null;
          isDraft: boolean;
          additions: number;
          deletions: number;
          changedFiles: number;
          comments: { totalCount: number };
          repository: {
            name: string;
            owner: { login: string; avatarUrl: string };
            url: string;
          };
        } | null>;
      };
    };

    const { nodes, pageInfo } = response.search;

    for (const node of nodes) {
      if (!node) continue;

      const state: "open" | "merged" | "closed" =
        node.state === "MERGED"
          ? "merged"
          : node.state === "CLOSED"
            ? "closed"
            : "open";

      allPRs.push({
        id: node.id,
        number: node.number,
        title: node.title,
        url: node.url,
        state,
        createdAt: node.createdAt,
        updatedAt: node.updatedAt,
        mergedAt: node.mergedAt,
        closedAt: node.closedAt,
        repository: {
          name: node.repository.name,
          owner: node.repository.owner.login,
          url: node.repository.url,
        },
        additions: node.additions,
        deletions: node.deletions,
        changedFiles: node.changedFiles,
        comments: node.comments.totalCount,
        isDraft: node.isDraft,
      });
    }

    hasNextPage = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;

    console.log(`Fetched ${allPRs.length} PRs so far...`);
  }

  // Sort by updatedAt (newest first)
  allPRs.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  // Extract organizations
  const orgMap = new Map<string, { avatarUrl: string; count: number }>();
  for (const pr of allPRs) {
    const owner = pr.repository.owner;
    const existing = orgMap.get(owner);
    if (existing) {
      existing.count++;
    } else {
      orgMap.set(owner, {
        avatarUrl: `https://github.com/${owner}.png`,
        count: 1,
      });
    }
  }

  const orgs: Organization[] = Array.from(orgMap.entries())
    .map(([name, data]) => ({
      name,
      avatarUrl: data.avatarUrl,
      prCount: data.count,
    }))
    .sort((a, b) => b.prCount - a.prCount);

  return { prs: allPRs, orgs };
}

function toJSTString(date: Date): string {
  return date.toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).replace(/\//g, "-");
}

async function main() {
  try {
    const { prs, orgs } = await fetchAllPRs();
    const lastUpdated = toJSTString(new Date());

    console.log(
      `Found ${prs.length} PRs from ${orgs.length} organizations`
    );

    // Generate TypeScript data files
    const prsContent = `// Auto-generated by batch/fetch-prs.ts
// Last updated: ${lastUpdated}

import type { PullRequest } from "@/lib/types";

export const prs: PullRequest[] = ${JSON.stringify(prs, null, 2)};

export const lastUpdated = "${lastUpdated}";
export const totalCount = ${prs.length};
`;

    const orgsContent = `// Auto-generated by batch/fetch-prs.ts
// Last updated: ${lastUpdated}

import type { Organization } from "@/lib/types";

export const orgs: Organization[] = ${JSON.stringify(orgs, null, 2)};
`;

    const dataDir = join(__dirname, "..", "src", "data");
    mkdirSync(dataDir, { recursive: true });

    writeFileSync(join(dataDir, "prs.ts"), prsContent);
    writeFileSync(join(dataDir, "orgs.ts"), orgsContent);

    console.log("Data files generated successfully!");

    // Generate OGP image with PR statistics
    const openPRs = prs.filter((pr) => pr.state === "open").length;
    const mergedPRs = prs.filter((pr) => pr.state === "merged").length;
    const closedPRs = prs.filter((pr) => pr.state === "closed").length;

    await generateOGPImage({
      totalPRs: prs.length,
      openPRs,
      mergedPRs,
      closedPRs,
      lastUpdated,
    });
  } catch (error) {
    console.error("Error fetching PRs:", error);
    process.exit(1);
  }
}

main();
