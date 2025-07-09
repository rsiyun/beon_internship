import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";


const HomeTable = ({homes, onEdit}) => {
    return (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>No</TableHead>
                <TableHead>status</TableHead>
                <TableHead>Aksi</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {homes.length > 0 ? (
                homes.map((home) => (
                    <TableRow key={home.id}>
                        <TableCell>{home.house_number}</TableCell>
                        <TableCell>{home.status}</TableCell>
                        <TableCell className="flex items-center gap-2">
                            <a className="inline-flex items-center h-9 px-4 py-2 has-[>svg]:px-3 text-primary underline-offset-4 hover:underline justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive" href={`rumah/${home.id}/detail`}>Detail</a>
                            <Button variant="outline" onClick={() => onEdit(home)}>Edit</Button>
                        </TableCell>
                    </TableRow>
                    ))
            ):(
                <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
        </TableBody>
    </Table>
    )
}

export default HomeTable;