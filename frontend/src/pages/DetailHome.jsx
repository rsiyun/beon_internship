import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { homeService } from "@/services/home-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Home, Loader2, Phone, Trash2, Users } from "lucide-react"
import { useParams } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AddOcupantDialog from "@/features/detail-home/AddOcupantDialog";
import { useState } from "react";
import { toast } from "sonner";
import RemoveOcupantDialog from "@/features/detail-home/RemoveOcupantDialog";

const DetailHome = () => {
    const queryClient = useQueryClient();
    const [selectedOcupant, setSelectedOcupant] = useState(null);
    const [openModalAddOcupant, setOpenModalAddOcupant] = useState(false);
    const [openModalRemoveOcupant, setOpenModalRemoveOcupant] = useState(false);
    const { id } = useParams();
    const houseId = parseInt(id);
    const {
        data: responseData,
        isLoading,
        isError,
        error,
      } = useQuery({
        queryKey: ['houseDetail', houseId],
        queryFn: () => homeService.getById(houseId),
        enabled: !!houseId,
      });

      const addResident = useMutation({
        mutationFn: (data) => homeService.addResident(data.id, data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["houseDetail"], houseId});
          setOpenModalAddOcupant(false);
          toast.success("Berhasil menambahkan rumah");
        },
        onError: (error) => {
          toast.error(error.message || "Gagal menambahkan rumah");
        }
      })

      const removeResident = useMutation({
        mutationFn: (data) => homeService.removeResident(data.id, data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["houseDetail"], houseId});
          setOpenModalRemoveOcupant(false);
          setSelectedOcupant(null);
          toast.success("Berhasil menghapus penghuni rumah");
        },
        onError: (error) => {
          toast.error(error.message || "Gagal menghapus penghuni rumah");
        }
      });

      const handleOpenModalRemoveOcupant = (ocupant) => {
        setSelectedOcupant(ocupant);
        setOpenModalRemoveOcupant(true);
      }

      const handleAddResident = async (data) => {
        addResident.mutate({
          ...data,
          id: houseId,
        });
      };

      const handleRemoveResident = async (data) => {
        removeResident.mutate({
          id: houseId,
          ...data,
        });
      }

      const house = responseData?.data;
      const currentResidents = house?.current_ocupants || [];
      if (isLoading) {
        return <div className="text-center p-8 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-gray-600">Memuat detail rumah...</p>
        </div>;
      }
    
      if (isError) {
        return (
          <div className="text-center p-8 text-red-500">
            Terjadi kesalahan: {error.message} <br />
          </div>
        );
      }
    return(
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Home className="h-8 w-8"/> Detail Rumah: {house.house_number}
            </h1>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Informasi Umum</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                <div className="flex items-center gap-2">
                    <span className="font-semibold">Nomor Rumah:</span> {house.house_number}
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold">Status:</span>
                    {house.status === 'occupied' ? 'Terisi' : 'Kosong'}
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold">Terakhir Diperbarui:</span>
                    {new Date(house.updated_at).toLocaleDateString('id-ID', {
                    day: '2-digit', month: 'long', year: 'numeric'
                    })}
                </div>
                </CardContent>
            </Card>
            <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Penghuni Aktif Saat Ini
          </CardTitle>
          <Button onClick={() => setOpenModalAddOcupant(true)}>
            Tambahkan Penghuni Baru
          </Button>
        </CardHeader>
        <CardContent>
          {currentResidents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Nomor Telepon</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentResidents.map((resident) => (
                  <TableRow key={resident.id}>
                    <TableCell className="font-medium">{resident.ocupant.name}</TableCell>
                    <TableCell>
                      <Badge variant={resident.is_current_resident ? 'default' : 'outline'}>
                        {resident.is_current_resident ? "aktif" : "tidak aktif"} 
                      </Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-muted-foreground" /> {resident.ocupant.phone}
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleOpenModalRemoveOcupant(resident)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Pindahkan/Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-4">Tidak ada penghuni aktif saat ini.</p>
          )}
        </CardContent>
      </Card>
      <AddOcupantDialog open={openModalAddOcupant} onOpenChange={setOpenModalAddOcupant} onSubmit={handleAddResident}/>
      <RemoveOcupantDialog open={openModalRemoveOcupant} onOpenChange={setOpenModalRemoveOcupant} onSubmit={handleRemoveResident} ocupant={selectedOcupant}/>
        </div>
    )
}
export default DetailHome