import Link from "next/link";
import { Plus, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

async function getComponents() {
  return prisma.component.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
}

const tierColors: Record<string, string> = {
  FREE: "bg-green-500/10 text-green-600",
  PRO: "bg-purple-500/10 text-purple-600",
  COMMUNITY_FREE: "bg-blue-500/10 text-blue-600",
  COMMUNITY_PAID: "bg-amber-500/10 text-amber-600",
};

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-500/10 text-gray-600",
  PENDING_REVIEW: "bg-yellow-500/10 text-yellow-600",
  PUBLISHED: "bg-green-500/10 text-green-600",
};

export default async function AdminComponentsPage() {
  const components = await getComponents();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Components</h1>
          <p className="text-muted-foreground mt-1">
            Manage all components in the registry
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/components/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Component
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {components.map((component) => (
              <TableRow key={component.id}>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium">{component.name}</p>
                    <p className="text-sm text-muted-foreground">{component.slug}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="capitalize">
                    {component.category.toLowerCase().replace("_", " ")}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className={tierColors[component.tier]} variant="secondary">
                    {component.tier}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[component.status]} variant="secondary">
                    {component.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {component.author.name || component.author.email}
                  </span>
                </TableCell>
                <TableCell>{component.downloads.toLocaleString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/components/${component.slug}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/components/${component.id}`}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
