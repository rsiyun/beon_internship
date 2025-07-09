import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddDuesTypeDialog from "@/features/dues-type/AddDuesTypeDialog";
import DuesTypeTable from "@/features/dues-type/DuesTypeTable";
import EditDuesTypeDialog from "@/features/dues-type/EditDuesTypeDialog";
import useDebounce from "@/hooks/use-debounce";
import { duesTypeService } from "@/services/duesType-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DuesType = () => {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDuesType, setSelectedDuesType] = useState(null);
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);

    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    const {
        data: responseData,
        isLoading,
        error,
        isError,
        isFetching,
    } = useQuery({
        queryKey: ["duesTypes", currentPage, debouncedSearchQuery],
        queryFn: () =>
            duesTypeService.getAllPaginate(currentPage, debouncedSearchQuery),
        staleTime: 1000,
        enabled: debouncedSearchQuery !== undefined,
    });

    const addHomeMutation = useMutation({
        mutationFn: (data) => duesTypeService.create(data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["duesTypes", currentPage, debouncedSearchQuery] });
          setOpenModalAdd(false);
          toast.success("Berhasil menambahkan tipe iuran");
        },
        onError: (error) => {
          toast.error(error.message || "Gagal menambahkan tipe iuran");
        }
      })

    const updateHomeMutation = useMutation({
        mutationFn: (data) => duesTypeService.update(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["duesTypes", currentPage, debouncedSearchQuery] });
            setOpenModalUpdate(false);
            setSelectedDuesType(null);
            toast.success("Berhasil memperbarui tipe iuran");
        },
        onError: (error) => {
            toast.error(error.message || "Gagal memperbarui tipe iuran");
        }
    })
    const duesTypes = responseData?.data?.data || [];
    const paginationInfo = responseData?.data;

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

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

    const handleOpenModalUpdate = (duesType) => {
        setSelectedDuesType(duesType);
        setOpenModalUpdate(true);
    };

    const handleAdd = async (formData) => {
        addHomeMutation.mutate(formData);
    }
    const handleUpdate = async (formData, id) => {
        updateHomeMutation.mutate({
            ...formData,
            id: id,
        });
    }

    if (isLoading) {
        return (
            <div className="text-center p-8 flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-gray-600">Memuat tipe iuran...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center p-8 text-red-500">
                Terjadi kesalahan: {error.message}
            </div>
        );
    }
    return (
    <div className="flex flex-col gap-4 p-4 pt-0">
        <div className="flex flex-row justify-between">
            <h1>Tipe Iuran</h1>
            <Button onClick={() => setOpenModalAdd(true)}>Tambah</Button>
        </div>

        <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
                className="max-w-xs"
            />
        </div>

        <div className="rounded-md border">
            <DuesTypeTable
                duesTypes={duesTypes} 
                onEdit={handleOpenModalUpdate}
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
                        disabled={currentPage === paginationInfo.last_page || isFetching}
                    >
                        Next
                    </Button>
                </div>
            </div>
        )}

        <AddDuesTypeDialog
            open={openModalAdd}
            onOpenChange={setOpenModalAdd}
            onSubmit={handleAdd}
        />
        <EditDuesTypeDialog
            open={openModalUpdate}
            onOpenChange={setOpenModalUpdate}
            onSubmit={handleUpdate}
            duesType={selectedDuesType}
        />
    </div>
    );
}

export default DuesType;