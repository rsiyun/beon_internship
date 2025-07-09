import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatRupiah } from "@/lib/format";
import { Loader2 } from "lucide-react";
import { reportService } from "@/services/report-services";
import { FinancialBarChart } from "@/components/templates/DiCharts";

const Report = () => {
  const currentDate = new Date();
  const [filters, setFilters] = useState({
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  });

  const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["report-summary", filters.month, filters.year],
    queryFn: () => reportService.getMonthlySummary(filters),
  });

  const { data: detailData, isLoading: isDetailLoading } = useQuery({
    queryKey: ["report-detail", filters.month, filters.year],
    queryFn: () => reportService.getMonthlyDetail(filters),
  });

  const years = Array.from({ length: 5 }, (_, i) => 
    currentDate.getFullYear() - i
  );

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: format(new Date(2024, i, 1), "MMMM", { locale: id }),
  }));

  if (isSummaryLoading || isDetailLoading) {
    return (
        <div className="text-center p-8 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-gray-600">Memuat list iuran...</p>
      </div>
    );
  }

  const summaryReportData = summaryData?.data || {};
  const detailReportData = detailData?.data || {};
  const monthlyReportData = summaryReportData?.monthly_data || [];

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Laporan Keuangan</h1>
        <div className="flex gap-2">
          <Select
            value={filters.month.toString()}
            onValueChange={(value) => 
              setFilters(prev => ({ ...prev, month: parseInt(value) }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.year.toString()}
            onValueChange={(value) => 
              setFilters(prev => ({ ...prev, year: parseInt(value) }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih Tahun" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Period Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Periode {summaryReportData.period_start} - {summaryReportData.period_end}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium">Total Pemasukan</p>
              <p className="text-2xl font-bold text-green-600">
                {formatRupiah(summaryReportData.periode_income)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Total Pengeluaran</p>
              <p className="text-2xl font-bold text-red-600">
                {formatRupiah(summaryReportData.periode_expense)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Saldo</p>
              <p className="text-2xl font-bold">
                {formatRupiah(summaryReportData.periode_balance)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Summary Table */}
      <FinancialBarChart
        data={monthlyReportData}
        title="Ringkasan Bulanan"
        description={`Periode ${summaryReportData.period_start} - ${summaryReportData.period_end}`}
      />

      {/* Monthly Detail */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Transaksi - {detailReportData.month}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Income Details */}
          <div>
            <h3 className="font-semibold mb-2">Pemasukan</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Rumah</TableHead>
                  <TableHead>Tipe Iuran</TableHead>
                  <TableHead>Pembayar</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detailReportData.incomes?.map((income) => (
                  <TableRow key={income.id}>
                    <TableCell>{income.house_number}</TableCell>
                    <TableCell>{income.dues_type}</TableCell>
                    <TableCell>{income.payer_name}</TableCell>
                    <TableCell>
                      {format(new Date(income.payment_date), "dd MMMM yyyy", { locale: id })}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatRupiah(income.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Expense Details */}
          <div>
            <h3 className="font-semibold mb-2">Pengeluaran</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipe Pengeluaran</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Catatan</TableHead>
                  <TableCell className="text-right">Jumlah</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detailReportData.expenses?.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.expense_type}</TableCell>
                    <TableCell>
                      {format(new Date(expense.expense_date), "dd MMMM yyyy", { locale: id })}
                    </TableCell>
                    <TableCell>{expense.notes || '-'}</TableCell>
                    <TableCell className="text-right">
                      {formatRupiah(expense.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Report;