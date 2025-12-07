import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { PropDefinition } from "@/lib/extract-props";

interface PropsTableProps {
  componentName: string;
  props: PropDefinition[];
}

export function PropsTable({ componentName, props }: PropsTableProps) {
  if (props.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Props</h2>
      <div>
        <h3 className="font-medium text-lg mb-3">{componentName} Props</h3>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Prop</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Default</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold text-right">Required</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {props.map((prop) => (
                <TableRow key={prop.name}>
                  <TableCell className="font-mono text-sm font-medium">
                    {prop.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {prop.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {prop.default || "-"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {prop.description}
                  </TableCell>
                  <TableCell className="text-right">
                    {prop.required ? (
                      <Badge variant="outline" className="text-xs">Yes</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">No</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
