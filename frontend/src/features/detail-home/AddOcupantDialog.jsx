
import DiFormSelectSearch from "@/components/templates/DiFormSelectSearch";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ocupantService } from "@/services/ocupant-service";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

const AddOcupantDialog = ({ open, onOpenChange, onSubmit }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ocupant_id: "",
      start_date: new Date(),
    },
  });

  const { data: ocupants } = useQuery({
    queryKey: ["ocupants"],
    queryFn: () => ocupantService.getAll(),
  });
  const ocupantOptions =
    ocupants?.data.map((ocupant) => ({
      value: ocupant.id.toString(),
      label: ocupant.name,
    })) || [];
  const handleFormSubmit = async (data) => {
    await onSubmit(data);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Rumah</DialogTitle>
          <DialogDescription>
            Isi detail rumah yang akan dirubah.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* ocupant search */}
          <DiFormSelectSearch 
            id="ocupant_id"
            label="Penghuni"
            control={control}
            rules={{ required: "Penghuni harus dipilih" }}
            options={ocupantOptions}
            placeholder="Pilih penghuni..."
            searchPlaceholder="Cari penghuni..."
            emptyMessage="Penghuni tidak ditemukan."
            error={errors.ocupant_id}
          />

          {/* date picker */}
          <div className="space-y-2">
            <Label htmlFor="start_date">Tanggal mulai ditinggali</Label>
            <Controller
              control={control}
              name="start_date"
              rules={{ required: "Tanggal harus diisi" }}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.start_date && (
              <p className="text-sm text-red-500">
                {errors.start_date.message}
              </p>
            )}
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
      </DialogContent>
    </Dialog>
  );
};

export default AddOcupantDialog;
