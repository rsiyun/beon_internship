import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddHomeDialog from "@/features/home/AddHomeDialog";
import EditHomeDialog from "@/features/home/EditHomeDialog";
import HomeTable from "@/features/home/HomeTable";
import useDebounce from "@/hooks/use-debounce";
import { homeService } from "@/services/home-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Home = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedHome, setSelectedHome] = useState(null);
  const [openModalAddHome, setOpenModalAddHome] = useState(false);
  const [openModalUpdateHome, setOpenModalUpdateHome] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const {
    data: responseData,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["homes", currentPage, debouncedSearchQuery],
    queryFn: () => homeService.getAllPaginate(currentPage, debouncedSearchQuery),
    staleTime: 1000,
    enabled: debouncedSearchQuery !== undefined,
  });


  const addHomeMutation = useMutation({
    mutationFn: (data) => homeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homes", currentPage, debouncedSearchQuery] });
      setOpenModalAddHome(false);
      toast.success("Berhasil menambahkan rumah");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menambahkan rumah");
    }
  })

  const updateHomeMutation = useMutation({
    mutationFn: (data) => homeService.update(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homes", currentPage, debouncedSearchQuery] });
      setOpenModalUpdateHome(false);
      setSelectedHome(null);
      toast.success("Berhasil memperbarui rumah");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal memperbarui rumah");
    }
  })

  
  const homes = responseData?.data?.data || [];
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

  const handleOpenModalUpdate = (home) => {
    setSelectedHome(home);
    setOpenModalUpdateHome(true);
  }

  const handleUpdateHome = async (data) => {
    updateHomeMutation.mutate(data);
  }

  const handleAddHome = async (data) => {
    addHomeMutation.mutate(data);
  }
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  // console.log(homes.data.data);
  return (
    <div className="flex flex-col gap-4 p-4 pt-0">
      <div className="flex flex-row justify-between">
        <h1>Home</h1>
        <Button  onClick={() => setOpenModalAddHome(true)}>Tambah</Button>
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
        <HomeTable homes={homes} onEdit={(home) => handleOpenModalUpdate(home)}/>
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
      <AddHomeDialog open={openModalAddHome} onOpenChange={setOpenModalAddHome} onSubmit={handleAddHome}/>
      <EditHomeDialog open={openModalUpdateHome} onOpenChange={setOpenModalUpdateHome} onSubmit={handleUpdateHome} defaultValues={selectedHome}/>

    </div>
  );
};

export default Home;
