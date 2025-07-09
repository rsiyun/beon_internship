import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { formatRupiah } from "@/lib/format";
const DuesTypeTable = ({ duesTypes = [], onEdit }) => {
    return(
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nama Tipe</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Nominal/Bulan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {duesTypes.length > 0 ? (
                    duesTypes.map((duesType) => (
                        <TableRow key={duesType.id}>
                            <TableCell className="font-medium">
                                {duesType.type_name}
                            </TableCell>
                            <TableCell>
                                {duesType.description || '-'}
                            </TableCell>
                            <TableCell>
                                {formatRupiah(duesType.default_amount_per_month)}
                            </TableCell>
                            <TableCell>
                                <Badge variant={duesType.is_active ? "default" : "secondary"}>
                                    {duesType.is_active ? "Aktif" : "Tidak Aktif"}
                                </Badge>
                            </TableCell>
                            <TableCell className="flex items-center gap-2">
                                <Button 
                                    variant="outline" 
                                    onClick={() => onEdit(duesType)}
                                >
                                    Edit
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            Tidak ada data.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}

export default DuesTypeTable;