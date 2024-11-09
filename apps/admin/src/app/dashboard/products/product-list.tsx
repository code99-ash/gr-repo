import React from 'react'
import { Trash2 } from 'lucide-react';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
   
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from '@/components/ui/checkbox';
   
 
type Product = {
    id: string;
    title: string;
    status: string;
    product_id: string;
    product_type: string;
    policies: number;
}

export const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "product_id",
      header: "Product ID",
      cell: ({ row }) => {
        return <div className="satoshi-medium flex items-center gap-4 text-primary">
          <Checkbox /> {row.getValue('product_id')}
        </div>
      }
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        return <div className="satoshi-medium">{row.getValue('title')}</div>
      }
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "product_type",
      header: "Category",
    },
    {
      accessorKey: "policies",
      header: "Policies",
      cell: () => {
        return <div>0</div>
      }
    },
]

export default function ProductList({ data, loading }: { data: Product[], loading: boolean }) {
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
    })
   
    return (
      <div className="rounded-md border">
        <Table className="bg-white">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="satoshi-bold tracking-wide text-foreground">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                    <TableCell>
                        <Trash2 />
                    </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {loading ? 'Loading...' : 'No results.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    )
}
