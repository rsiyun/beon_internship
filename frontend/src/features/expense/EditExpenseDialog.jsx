import DiFormCalendar from "@/components/templates/DiFormCalender";
import DiFormDialog from "@/components/templates/DiFormDialog";
import DiFormField from "@/components/templates/DiFormField";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const EditExpenseDialog = ({ open, onOpenChange, onSubmit, expense }) => {
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

  useEffect(() => {
    if (expense) {
      reset({
        expense_type: expense.expense_type,
        amount: expense.amount,
        expense_date: new Date(expense.expense_date),
        description: expense.description || "",
      });
    }
  }, [expense, reset]);
  const handleFormSubmit = async (data) => {
    // Convert amount to number and format date
    const formattedData = {
      ...data,
      amount: parseFloat(data.amount),
      expense_date: format(data.expense_date, "yyyy-MM-dd"),
    };
    await onSubmit(formattedData, expense.id);
    reset();
  };
  return (
    <DiFormDialog
      onOpenChange={onOpenChange}
      open={open}
      title="Edit Pengeluaran"
      description="Isi detail pengeluaran yang akan dirubah."
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
              message: "Tipe pengeluaran maksimal 255 karakter",
            },
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
              message: "Minimal nominal Rp 1",
            },
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
          <Button type="submit">Simpan Perubahan</Button>
        </div>
      </form>
    </DiFormDialog>
  );
};

export default EditExpenseDialog;
