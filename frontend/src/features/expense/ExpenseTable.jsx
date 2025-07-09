import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatRupiah } from "@/lib/format";

const ExpenseTable = ({ expenses = [], onEdit }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Tipe Pengeluaran</TableHead>
                    <TableHead>Nominal</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {expenses.length > 0 ? (
                    expenses.map((expense) => (
                        <TableRow key={expense.id}>
                            <TableCell className="font-medium">
                                {expense.expense_type}
                            </TableCell>
                            <TableCell>
                                {formatRupiah(expense.amount)}
                            </TableCell>
                            <TableCell>
                                {format(new Date(expense.expense_date), "dd MMMM yyyy", { locale: id })}
                            </TableCell>
                            <TableCell>
                                {expense.description || '-'}
                            </TableCell>
                            <TableCell className="flex items-center gap-2">
                                <Button 
                                    variant="outline" 
                                    onClick={() => onEdit(expense)}
                                >
                                    Edit
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            Tidak ada data pengeluaran.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default ExpenseTable;