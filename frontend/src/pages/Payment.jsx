import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PaymentTable from "@/features/payment/PaymentTable";
import useDebounce from "@/hooks/use-debounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { paymentService } from "@/services/payment-services";
import { duesTypeService } from "@/services/duesType-service";
import AddPaymentDialog from "@/features/payment/AddPaymentDialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import EditPaymentDialog from "@/features/payment/EditPaymentDialog";

const Payment = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [openModalAddPayment, setOpenModalAddPayment] = useState(false);
  const [openModalEditPayment, setOpenModalEditPayment] = useState(false);
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    dues_type_id: "all",
    status: "all",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const debouncedSearchQuery = useDebounce(filters.search, 500);

  const {
    data: responseData,
    isLoading,
    error,
    isError,
    isFetching,
  } = useQuery({
    queryKey: [
      "payments",
      filters.page,
      debouncedSearchQuery,
      filters.dues_type_id,
      filters.month,
      filters.year,
      filters.status,
    ],
    queryFn: () => paymentService.getAllPaginate(filters),
    staleTime: 1000,
  });

  // Fetch dues types for filter
  const { data: duesTypesData } = useQuery({
    queryKey: ["duesTypes"],
    queryFn: () => duesTypeService.getAll(),
  });

  const payments = responseData?.data?.data || [];
  const paginationInfo = responseData?.data;
  const duesTypes = duesTypesData?.data || [];

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString("id-ID", { month: "long" }),
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value,
    }));
  };

  const handlePreviousPage = () => {
    if (paginationInfo && filters.page > 1) {
      handleFilterChange("page", filters.page - 1);
    }
  };

  const paymentAddMutation = useMutation({
    mutationFn: (data) => paymentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: [
          "payments",
          filters.page,
          debouncedSearchQuery,
          filters.dues_type_id,
          filters.month,
          filters.year,
          filters.status,
        ]
       });
       setOpenModalAddPayment(false);
      toast.success("Berhasil menambahkan rumah");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menambahkan rumah");
    }
  })
  const paymentUpdateMutation = useMutation({
    mutationFn: (data) => paymentService.update(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["payments"]);
      setOpenModalEditPayment(false);
      toast.success("Berhasil mengubah pembayaran");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal mengubah pembayaran");
    },
  });

  const handleNextPage = () => {
    if (paginationInfo && filters.page < paginationInfo.last_page) {
      handleFilterChange("page", filters.page + 1);
    }
  };

  const handleAddPayment = async (data) => {
    paymentAddMutation.mutate(data);
  }

  const handleEditPayment = async (data) => {
    paymentUpdateMutation.mutate(data);
  };

  const handleOpenModalEdit = (payment) => {
    setSelectedPayment(payment);
    setOpenModalEditPayment(true);
  }

  if (isLoading) {
    return (
      <div className="text-center p-8 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-gray-600">Memuat list iuran...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-8 text-red-500">
        Terjadi kesalahan: {error.message} <br />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 pt-0">
      <div className="flex flex-row justify-between">
        <h1>Pembayaran</h1>
      </div>

      <div className="flex items-center justify-between">
        <Input
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="md:col-span-2 max-w-1/2"
        />
        <div className="flex gap-2">
          <Select
            value={filters.dues_type_id}
            onValueChange={(value) => handleFilterChange("dues_type_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Tipe Iuran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              {duesTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.type_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status Pembayaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="paid">Sudah Dibayar</SelectItem>
              <SelectItem value="unpaid">Belum Dibayar</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.month.toString()}
            onValueChange={(value) =>
              handleFilterChange("month", parseInt(value))
            }
          >
            <SelectTrigger>
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
            onValueChange={(value) => handleFilterChange("year", parseInt(value))}
          >
            <SelectTrigger>
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
          <Button onClick={() => setOpenModalAddPayment(true)}>
            Tambah Pembayaran
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <PaymentTable payments={payments} onEdit={(payment) => handleOpenModalEdit(payment)}/>
      </div>

      {paginationInfo && paginationInfo.last_page > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            Halaman {filters.page} dari {paginationInfo.last_page} (Total{" "}
            {paginationInfo.total} data)
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={filters.page === 1 || isFetching}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={filters.page === paginationInfo.last_page || isFetching}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      <AddPaymentDialog
        open={openModalAddPayment}
        onOpenChange={setOpenModalAddPayment}
        onSubmit={handleAddPayment}
      />
      <EditPaymentDialog 
        open={openModalEditPayment}
        onOpenChange={setOpenModalEditPayment}
        onSubmit={handleEditPayment}
        payment={selectedPayment}
      />
    </div>
  );
};

export default Payment;
