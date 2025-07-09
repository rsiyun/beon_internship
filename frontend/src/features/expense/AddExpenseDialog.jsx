import DiFormDialog from "@/components/templates/DiFormDialog";
import DiFormField from "@/components/templates/DiFormField";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import DiFormCalendar from "@/components/templates/DiFormCalender";

const AddExpenseDialog = ({ open, onOpenChange, onSubmit }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      expense_type: "",
      amount: "",
      expense_date: new Date(),
      description: "",
    },
  });

  const handleFormSubmit = async (data) => {
    const formattedData = {
      ...data,
      amount: parseFloat(data.amount),
      expense_date: format(data.expense_date, "yyyy-MM-dd"),
    };
    await onSubmit(formattedData);
    reset();
  };

  return (
    <DiFormDialog
      onOpenChange={onOpenChange}
      open={open}
      title="Tambah Pengeluaran"
      description="Isi detail pengeluaran yang akan ditambahkan."
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <DiFormField
          id="expense_type"
          label="Tipe Pengeluaran"
          register={register}
          rules={{ 
            required: "Tipe pengeluaran harus diisi",
            maxLength: {
              value: 255,
              message: "Tipe pengeluaran maksimal 255 karakter"
            }
          }}
          error={errors.expense_type}
        />

        <DiFormField
          id="amount"
          label="Nominal"
          type="number"
          register={register}
          rules={{
            required: "Nominal harus diisi",
            min: {
              value: 1,
              message: "Minimal nominal Rp 1"
            }
          }}
          error={errors.amount}
        />

        <DiFormCalendar
          id="expense_date"
          label="Tanggal Pengeluaran"
          control={control}
          rules={{ required: "Tanggal pengeluaran harus diisi" }}
          error={errors.expense_date}
        />

        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            id="description"
            placeholder="Deskripsi (opsional)"
            {...register("description")}
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

export default AddExpenseDialog;