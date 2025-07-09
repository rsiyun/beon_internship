import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddExpenseDialog from "@/features/expense/AddExpenseDialog";
import EditExpenseDialog from "@/features/expense/EditExpenseDialog";
import ExpenseTable from "@/features/expense/ExpenseTable";
import useDebounce from "@/hooks/use-debounce";
import { expenseService } from "@/services/expense-services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const Expense = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModalAddExpense, setOpenModalAddExpense] = useState(false);
  const [openModalEditExpense, setOpenModalEditExpense] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch expenses with search and pagination
  const {
    data: responseData,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["expenses", currentPage, debouncedSearchQuery],
    queryFn: () =>
      expenseService.getAllPaginate({
        page: currentPage,
        search: debouncedSearchQuery,
      }),
  });

  // Add expense mutation
  const expenseAddMutation = useMutation({
    mutationFn: (data) => expenseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["expenses"]);
      setOpenModalAddExpense(false);
      toast.success("Berhasil menambahkan pengeluaran");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menambahkan pengeluaran");
    },
  });

  // Update expense mutation
  const expenseUpdateMutation = useMutation({
    mutationFn: ({ data, id }) => expenseService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["expenses"]);
      setOpenModalEditExpense(false);
      toast.success("Berhasil mengubah pengeluaran");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal mengubah pengeluaran");
    },
  });

  const handleAddExpense = async (data) => {
    expenseAddMutation.mutate(data);
  };

  const handleEditExpense = async (data, id) => {
    expenseUpdateMutation.mutate({ data, id });
  };

  const handleOpenModalEdit = (expense) => {
    setSelectedExpense(expense);
    setOpenModalEditExpense(true);
  };

  const expenses = responseData?.data?.data || [];
  const paginationInfo = responseData?.data;

  const handlePreviousPage = () => {
    if (paginationInfo && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (paginationInfo && currentPage < paginationInfo.last_page) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col gap-4 p-4 pt-0">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-2xl font-bold">Pengeluaran</h1>
        <Button onClick={() => setOpenModalAddExpense(true)}>
          Tambah Pengeluaran
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <Input
          placeholder="Cari pengeluaran..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <ExpenseTable 
          expenses={expenses} 
          onEdit={handleOpenModalEdit}
        />
      </div>

      {paginationInfo && paginationInfo.last_page > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            Halaman {currentPage} dari {paginationInfo.last_page} (Total{" "}
            {paginationInfo.total} data)
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || isFetching}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={
                currentPage === paginationInfo.last_page || isFetching
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <AddExpenseDialog
        open={openModalAddExpense}
        onOpenChange={setOpenModalAddExpense}
        onSubmit={handleAddExpense}
      />

      <EditExpenseDialog
        open={openModalEditExpense}
        onOpenChange={setOpenModalEditExpense}
        onSubmit={handleEditExpense}
        expense={selectedExpense}
      />
    </div>
  );
};

export default Expense;