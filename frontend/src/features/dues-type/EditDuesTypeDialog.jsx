import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import DiFormDialog from "@/components/templates/DiFormDialog";
import DiFormField from "@/components/templates/DiFormField";

const EditDuesTypeDialog = ({ open, onOpenChange, onSubmit, duesType }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type_name: "",
      description: "",
      amount: "",
      is_active: true,
    },
  });

  // Reset form when duesType changes
  useEffect(() => {
    if (duesType) {
      reset({
        type_name: duesType.type_name,
        description: duesType.description || "",
        amount: duesType.default_amount_per_month,
        is_active: duesType.is_active === 1,
      });
    }
  }, [duesType, reset]);

  const handleFormSubmit = async (data) => {
    // Convert amount string to number
    data.amount = parseFloat(data.amount);
    await onSubmit(data, duesType.id);
    reset();
  };

  return (
    <DiFormDialog
      onOpenChange={onOpenChange}
      open={open}
      title="Edit Tipe Iuran"
      description="Ubah detail tipe iuran yang dipilih."
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <DiFormField
          id="type_name"
          label="Nama Tipe"
          register={register}
          rules={{ required: "Nama tipe harus diisi" }}
          error={errors.type_name}
        />

        <DiFormField
          id="description"
          label="Deskripsi"
          register={register}
          placeholder="Deskripsi (opsional)"
        />

        <DiFormField
          id="amount"
          label="Nominal per Bulan"
          type="number"
          register={register}
          rules={{
            required: "Nominal harus diisi",
            min: {
              value: 1000,
              message: "Minimal nominal Rp 1.000",
            },
          }}
          error={errors.amount}
        />

        <div className="flex items-center space-x-2">
          <Switch id="is_active" {...register("is_active")} />
          <Label htmlFor="is_active">Aktif</Label>
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

export default EditDuesTypeDialog;
