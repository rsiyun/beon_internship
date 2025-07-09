import DiSelect from "@/components/templates/DiFormSelect";
import DiSelectSearch from "@/components/atom/DiSelectSearch";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
// import { ocupantService } from "@/services/ocupant-service";
// import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

const RemoveOcupantDialog = ({ open, onOpenChange, onSubmit, ocupant }) => {
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

  // const { data: ocupants } = useQuery({
  //   queryKey: ["ocupants"],
  //   queryFn: () => ocupantService.getAll(),
  // });
  const handleFormSubmit = async (data) => {
    await onSubmit({
      ocupant_id: ocupant.ocupant_id,
      end_date: data.end_date,
    });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Rumah</DialogTitle>
          <DialogDescription>
            Isi detail rumah yang akan dirubah
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <h1>{ocupant?.ocupant.name ?? ""}</h1>
          {/* date picker */}
          <div className="space-y-2">
            <Label htmlFor="end_date">Tanggal Selesai huni</Label>
            <Controller
              control={control}
              name="end_date"
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
            {errors.end_date && (
              <p className="text-sm text-red-500">
                {errors.end_date.message}
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
            <Button variant="destructive" size="sm" type="submit">
              Hapus
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveOcupantDialog;
