import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { droneIncome } from "./Charts";

const droneNames = ["AgriHawk Alpha", "SkyMapper Pro", "CropWatch Mini"] as const;
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

type DroneRow = {
  name: string;
  months: Record<string, number>;
  total: number;
};

function buildRows(): DroneRow[] {
  return droneNames.map((name) => {
    const monthsRecord: Record<string, number> = {};
    let total = 0;
    for (const m of months) {
      const val = (droneIncome.find((d) => d.month === m) as any)?.[name] ?? 0;
      monthsRecord[m] = val;
      total += val;
    }
    return { name, months: monthsRecord, total };
  });
}

type SortDir = "asc" | "desc" | null;

export function DroneIncomeTable() {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDir>("desc");

  const rows = React.useMemo(() => buildRows(), []);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortedRows = React.useMemo(() => {
    if (!sortKey) return rows;
    const dir = sortDir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;
      if (sortKey === "name") {
        aVal = a.name;
        bVal = b.name;
      } else if (sortKey === "total") {
        aVal = a.total;
        bVal = b.total;
      } else {
        aVal = a.months[sortKey] ?? 0;
        bVal = b.months[sortKey] ?? 0;
      }
      if (typeof aVal === "string" && typeof bVal === "string") {
        return aVal.localeCompare(bVal) * dir;
      }
      return ((aVal as number) - (bVal as number)) * dir;
    });
  }, [rows, sortKey, sortDir]);

  const SortIcon = ({ column }: { column: string }) => {
    if (sortKey !== column) return <ArrowUpDown className="ml-1 h-3 w-3 inline text-muted-foreground" />;
    return sortDir === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3 inline text-primary" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3 inline text-primary" />
    );
  };

  const HeaderCell = ({
    column,
    children,
    className,
  }: {
    column: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <TableHead
      className={`cursor-pointer select-none whitespace-nowrap ${className ?? ""}`}
      onClick={() => handleSort(column)}
    >
      <span className="flex items-center">
        {children}
        <SortIcon column={column} />
      </span>
    </TableHead>
  );

  return (
    <Card className="card-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-heading">Drone Income Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <HeaderCell column="name">Drone</HeaderCell>
              {months.map((m) => (
                <HeaderCell key={m} column={m} className="text-right">
                  {m}
                </HeaderCell>
              ))}
              <HeaderCell column="total" className="text-right">
                YTD Total
              </HeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRows.map((row) => (
              <TableRow key={row.name}>
                <TableCell className="font-medium whitespace-nowrap">{row.name}</TableCell>
                {months.map((m) => (
                  <TableCell key={m} className="text-right tabular-nums">
                    ${row.months[m].toLocaleString()}
                  </TableCell>
                ))}
                <TableCell className="text-right font-semibold tabular-nums text-primary">
                  ${row.total.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
