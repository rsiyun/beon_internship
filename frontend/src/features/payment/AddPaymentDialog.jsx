import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  SelectItem,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { homeService } from "@/services/home-service";
// import { duesTypeService } from "@/services/duesType-service";
import { format } from "date-fns";
import { ocupantService } from "@/services/ocupant-service";
import { duesTypeService } from "@/services/duesType-service";
import { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import DiFormDialog from "@/components/templates/DiFormDialog";
import DiFormSelect from "@/components/templates/DiFormSelect";
import DiFormField from "@/components/templates/DiFormField";
import DiFormCalendar from "@/components/templates/DiFormCalender";
import DiFormSelectSearch from "@/components/templates/DiFormSelectSearch";

const AddPaymentDialog = ({ open, onOpenChange, onSubmit }) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      home_id: "",
      ocupant_id: "",
      dues_type_id: "",
      payment_date: new Date(),
      number_of_months: 1,
      payment_status: "unpaid",
      notes: "",
    },
  });

  const { data: homesData } = useQuery({
    queryKey: ["homes"],
    queryFn: () => homeService.getAll(),
  });

  const { data: duesTypesData } = useQuery({
    queryKey: ["duesTypes"],
    queryFn: () => duesTypeService.getAll(),
  });
  const selectedHomeId = watch("home_id");
  useEffect(() => {
    // Reset ocupant_id when home_id changes
    setValue('ocupant_id', '');
  }, [selectedHomeId, setValue]);
  const { data: ocupantsData } = useQuery({
    queryKey: ["ocupants", selectedHomeId],
    queryFn: () => ocupantService.getByHomeId(selectedHomeId),
    enabled: !!selectedHomeId,
  });
  const homeOptions = homesData?.data.map((home) => ({
      value: home.id.toString(),
      label: home.house_number,
    })) || [];
  const ocupantOptions = ocupantsData?.data.map((ocupant) => ({
      value: ocupant.id.toString(),
      label: ocupant.name,
    })) || [];

    const duesTypeOptions = duesTypesData?.data.map((duesType) => ({
    value: duesType.id.toString(),
    label: duesType.type_name,
    })) || [];
  // const homes = homesData?.data || [];
  //   const duesTypes = duesTypesData?.data || [];
  const handleFormSubmit = async (data) => {
    await onSubmit({
      ...data,
      payment_date: format(data.payment_date, "yyyy-MM-dd"),
    });
    reset();
  };
  return (
      <DiFormDialog open={open} onOpenChange={onOpenChange} title="Tambah Penghuni" description="Isi detail penghuni yang akan ditambahkan.">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <DiFormSelectSearch
          id="home_id"
          label="Nomor Rumah"
          control={control}
          rules={{ required: "Nomor rumah harus dipilih" }}
          options={homeOptions}
          placeholder="Pilih nomor rumah..."
          searchPlaceholder="Cari rumah..."
          emptyMessage="rumah tidak ditemukan."
          error={errors.home_id}
          onValueChange={() => setValue("ocupant_id", "")}
        />
        <DiFormSelectSearch
          id="ocupant_id"
          label="Penghuni"
          control={control}
          rules={{ required: "Penghuni harus dipilih" }}
          options={ocupantOptions}
          placeholder="Pilih penghuni..."
          searchPlaceholder="Cari penghuni..."
          emptyMessage="penghuni tidak ditemukan."
          error={errors.ocupant_id}
        />
        <DiFormSelectSearch
          id="dues_type_id"
          label="Tipe Iuran"
          control={control}
          rules={{ required: "Tipe Iuran harus dipilih" }}
          options={duesTypeOptions}
          placeholder="Pilih tipe iuran..."
          searchPlaceholder="Cari tipe iuran..."
          emptyMessage="tipe iuran tidak ditemukan."
          error={errors.dues_type_id}
        />

        <DiFormCalendar
          id="payment_date"
          label="Tanggal Pembayaran"
          control={control}
          rules={{ required: "Tanggal pembayaran harus diisi" }}
          error={errors.payment_date}
        />
        <DiFormField
          id="number_of_months"
          label="Jumlah Bulan"
          type="number"
          register={register}
          rules={{
            required: "Jumlah bulan harus diisi",
            min: { value: 1, message: "Minimal 1 bulan" },
          }}
          error={errors.number_of_months}
        />

        <DiFormSelect
          id="payment_status"
          label="Status Pembayaran"
          control={control}
          rules={{ required: "Status pembayaran harus dipilih" }}
          error={errors.payment_status}
          placeholder="Pilih status"
        >
          <SelectItem value="paid">Sudah Dibayar</SelectItem>
          <SelectItem value="unpaid">Belum Dibayar</SelectItem>
        </DiFormSelect>

          <div className="space-y-2">
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              placeholder="Tambahkan catatan (opsional)"
              {...register("notes")}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
        
      </DiFormDialog>
  );
};
export default AddPaymentDialog;
