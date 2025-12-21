"use client";

import { Search, Building2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Organization, FilterStatus } from "@/lib/types";

interface PRFilterProps {
  orgs: Organization[];
  status: FilterStatus;
  search: string;
  org: string;
  onStatusChange: (status: FilterStatus) => void;
  onSearchChange: (search: string) => void;
  onOrgChange: (org: string) => void;
}

export function PRFilter({
  orgs,
  status,
  search,
  org,
  onStatusChange,
  onSearchChange,
  onOrgChange,
}: PRFilterProps) {
  return (
    <div className="mb-6 space-y-4">
      <Tabs value={status} onValueChange={(v) => onStatusChange(v as FilterStatus)}>
        <TabsList className="grid w-full grid-cols-4 h-11">
          <TabsTrigger value="all" className="text-sm">All</TabsTrigger>
          <TabsTrigger value="open" className="flex items-center gap-1.5 text-sm">
            <span className="h-2 w-2 rounded-full bg-pr-open" />
            Open
          </TabsTrigger>
          <TabsTrigger value="merged" className="flex items-center gap-1.5 text-sm">
            <span className="h-2 w-2 rounded-full bg-pr-merged" />
            Merged
          </TabsTrigger>
          <TabsTrigger value="closed" className="flex items-center gap-1.5 text-sm">
            <span className="h-2 w-2 rounded-full bg-pr-closed" />
            Closed
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search PRs by title, repo, or #number..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <Select value={org} onValueChange={onOrgChange}>
          <SelectTrigger className="w-full sm:w-[220px] h-10">
            <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="All Organizations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Organizations</SelectItem>
            {orgs.map((o) => (
              <SelectItem key={o.name} value={o.name}>
                <div className="flex items-center gap-2">
                  <img
                    src={o.avatarUrl}
                    alt={o.name}
                    className="w-4 h-4 rounded-sm"
                  />
                  <span>{o.name}</span>
                  <span className="text-muted-foreground">({o.prCount})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
