import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatRupiah } from "@/lib/format";
import { Button } from "@/components/ui/button";

const PaymentTable = ({ payments = [], onEdit}) => {
    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'success';
            case 'unpaid':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    const formatPaymentStatus = (status) => {
        switch (status) {
            case 'paid':
                return 'Lunas';
            case 'unpaid':
                return 'Belum Lunas';
            default:
                return status;
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>No. Rumah</TableHead>
                    <TableHead>Nama Penghuni</TableHead>
                    <TableHead>Tipe Iuran</TableHead>
                    <TableHead>Tanggal Bayar</TableHead>
                    <TableHead>Jumlah Bulan</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Catatan</TableHead>
                    <TableHead>Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {payments.length > 0 ? (
                    payments.map((payment) => (
                        <TableRow key={payment.id}>
                            <TableCell className="font-medium">
                                {payment.home.house_number}
                            </TableCell>
                            <TableCell>{payment.ocupant.name}</TableCell>
                            <TableCell>{payment.dues_type.type_name}</TableCell>
                            <TableCell>
                                {format(new Date(payment.payment_date), "dd MMMM yyyy", { locale: id })}
                            </TableCell>
                            <TableCell className="text-center">
                                {payment.number_of_months} bulan
                            </TableCell>
                            <TableCell>{formatRupiah(payment.amount)}</TableCell>
                            <TableCell>
                                <Badge variant={getPaymentStatusColor(payment.payment_status)}>
                                    {formatPaymentStatus(payment.payment_status)}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {payment.notes || '-'}
                            </TableCell>
                            <TableCell className="flex items-center gap-2">
                                <Button variant="outline" onClick={() => onEdit(payment)}>
                                    Edit
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                            Tidak ada data pembayaran.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default PaymentTable;