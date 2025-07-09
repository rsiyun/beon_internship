import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddOcupantDialog from "@/features/ocupant/AddOcupantDialog";
import EditOcupantDialog from "@/features/ocupant/EditOcupantDialog";
import OcupantTable from "@/features/ocupant/OcupantTable";
import useDebounce from "@/hooks/use-debounce";
import { ocupantService } from "@/services/ocupant-service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Ocupant = () => {
    const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
    const [selectedOcupant, setSelectedOcupant] = useState(null);
  const [openModalAddOcupant, setOpenModalAddOcupant] = useState(false);
  const [openModalUpdateOcupant, setOpenModalUpdateOcupant] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const {
    data: responseData,
    isLoading,
    error,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["ocupants", currentPage, debouncedSearchQuery],
    queryFn: () =>
      ocupantService.getAllPaginate(currentPage, debouncedSearchQuery),
    staleTime: 1000,
    enabled: debouncedSearchQuery !== undefined,
  });

  const ocupants = responseData?.data?.data || [];
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
  const handleOpenModalUpdateOcupant = (ocupant) => {
    console.log("Selected Ocupant:", ocupant);
    setSelectedOcupant(ocupant);
    setOpenModalUpdateOcupant(true);
  };

  const handleAddOcupant = async (formData) => {
    // addOcupantMutation.mutate(formData);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ocupant`, {
       method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal menambahkan penghuni');
      }

      // Refresh data after successful addition
      queryClient.invalidateQueries({ 
        queryKey: ["ocupants", currentPage, debouncedSearchQuery] 
      });
      
      setOpenModalAddOcupant(false);
      toast.success("Berhasil menambahkan penghuni");

    } catch (error) {
      console.error('Error adding ocupant:', error);
      toast.error(error.message || "Gagal menambahkan penghuni");
    }
  };

  const handleUpdateOcupant = async (formData, id) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/ocupant/${id}`, {
         method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });
  
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Gagal merubah penghuni');
        }
  
        // Refresh data after successful addition
        queryClient.invalidateQueries({ 
          queryKey: ["ocupants", currentPage, debouncedSearchQuery] 
        });
        
        setOpenModalUpdateOcupant(false);
        toast.success("Berhasil merubah penghuni");
  
      } catch (error) {
        toast.error(error.message || "Gagal merubah penghuni");
      }
  }

  if (isLoading) {
    return (
      <div className="text-center p-8 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-gray-600">Memuat detail rumah...</p>
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
        <h1>Ocupant</h1>
        <Button onClick={() => setOpenModalAddOcupant(true)}>Tambah</Button>
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
        <OcupantTable ocupants={ocupants} onEdit={(ocupant) => handleOpenModalUpdateOcupant(ocupant)}/>
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
      {/* <AddHomeDialog open={openModalAddHome} onOpenChange={setOpenModalAddHome} onSubmit={handleAddHome}/>*/}
      <EditOcupantDialog
        open={openModalUpdateOcupant}
        onOpenChange={setOpenModalUpdateOcupant}
        onSubmit={handleUpdateOcupant}
        ocupant={selectedOcupant}
      />
     <AddOcupantDialog
        open={openModalAddOcupant}
        onOpenChange={setOpenModalAddOcupant}
        onSubmit={handleAddOcupant}
      />
    </div>
  );
};

export default Ocupant;
