import DiFormDialog from "@/components/templates/DiFormDialog";
import DiFormField from "@/components/templates/DiFormField";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";

const AddDuesTypeDialog = ({ open, onOpenChange, onSubmit }) => {
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

  const handleFormSubmit = async (data) => {
    data.amount = parseFloat(data.amount);
    await onSubmit(data);
    reset();
  };
  return (
    <DiFormDialog
      onOpenChange={onOpenChange}
      open={open}
      title="Tambah Tipe Iuran"
      description="Isi detail tipe iuran yang akan ditambahkan."
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
          <Switch id="is_active" {...register("is_active")} defaultChecked />
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

export default AddDuesTypeDialog;
