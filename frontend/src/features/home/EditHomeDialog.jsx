import DiFormDialog from "@/components/templates/DiFormDialog";
import DiFormSelect from "@/components/templates/DiFormSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const EditHomeDialog = ({ open, onOpenChange, onSubmit, defaultValues }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      house_number: defaultValues?.house_number || "",
      status: defaultValues?.status || "unoccupied",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        house_number: defaultValues.house_number,
        status: defaultValues.status,
      });
    }
  }, [defaultValues, reset]);

  const handleFormSubmit = async (data) => {
    await onSubmit({
      id: defaultValues.id,
      house_number: data.house_number,
      status: data.status,
    });
    reset();
  };
  return (
    <DiFormDialog
      onOpenChange={onOpenChange}
      open={open}
      title="Edit Rumah"
      description="Isi detail rumah yang akan dirubah."
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="house_number">Nomor Rumah</Label>
          <Input
            id="house_number"
            {...register("house_number", {
              required: "Nomor rumah harus diisi",
            })}
          />
          {errors.house_number && (
            <p className="text-sm text-red-500">
              {errors.house_number.message}
            </p>
          )}
        </div>
        <DiFormSelect
          id={"status"}
          label={"Status"}
          control={control}
          rules={{ required: "status harus dipilih" }}
          placeholder="Pilih status"
        >
          <SelectItem value="occupied">Terisi</SelectItem>
          <SelectItem value="unoccupied">Kosong</SelectItem>
        </DiFormSelect>
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
export default EditHomeDialog;
