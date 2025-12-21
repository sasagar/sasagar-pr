"use client";

import { useState, useMemo } from "react";
import { PRFilter } from "@/components/pr-filter";
import { PRCard } from "@/components/pr-card";
import { Pagination } from "@/components/pagination";
import type { PullRequest, Organization, FilterStatus } from "@/lib/types";

interface PRListProps {
  prs: PullRequest[];
  orgs: Organization[];
}

const ITEMS_PER_PAGE = 30;

export function PRList({ prs, orgs }: PRListProps) {
  const [status, setStatus] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [org, setOrg] = useState("all");
  const [page, setPage] = useState(1);

  const handleStatusChange = (newStatus: FilterStatus) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleOrgChange = (newOrg: string) => {
    setOrg(newOrg);
    setPage(1);
  };

  const filteredPRs = useMemo(() => {
    return prs.filter((pr) => {
      if (status !== "all" && pr.state !== status) return false;
      if (org !== "all" && pr.repository.owner !== org) return false;
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesTitle = pr.title.toLowerCase().includes(searchLower);
        const matchesRepo = pr.repository.name.toLowerCase().includes(searchLower);
        const matchesOwner = pr.repository.owner.toLowerCase().includes(searchLower);
        const matchesNumber = `#${pr.number}`.includes(searchLower);
        if (!matchesTitle && !matchesRepo && !matchesOwner && !matchesNumber) return false;
      }
      return true;
    });
  }, [prs, status, org, search]);

  const totalPages = Math.ceil(filteredPRs.length / ITEMS_PER_PAGE);
  const paginatedPRs = filteredPRs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div>
      <PRFilter orgs={orgs} status={status} search={search} org={org}
        onStatusChange={handleStatusChange} onSearchChange={handleSearchChange} onOrgChange={handleOrgChange} />
      <p className="mb-4 text-sm text-muted-foreground">{filteredPRs.length} PRs found</p>
      {paginatedPRs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No pull requests found.</p>
          {search && <p className="mt-2 text-sm">Try adjusting your search or filters.</p>}
        </div>
      ) : (
        <div className="grid gap-4">
          {paginatedPRs.map((pr) => (<PRCard key={pr.id} pr={pr} />))}
        </div>
      )}
      {totalPages > 1 && <div className="mt-6"><Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} /></div>}
    </div>
  );
}
