import DiFormDialog from "@/components/templates/DiFormDialog";
import DiFormField from "@/components/templates/DiFormField";
import DiFormSelect from "@/components/templates/DiFormSelect";
import DiSelect from "@/components/templates/DiFormSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
const AddOcupantDialog = ({ open, onOpenChange, onSubmit }) => {
const [imagePreview, setImagePreview] = useState(null);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
        name: "",
        phone: "",
        resident_status: "",
        is_married: "",
        identity_card: null,
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("resident_status", data.resident_status);
    formData.append("is_married", data.is_married);

    if (data.identity_card[0]) {
        formData.append("identity_card", data.identity_card[0]);
    }
    await onSubmit(formData);
    setImagePreview(null);
    reset();
  };
  return (
    <DiFormDialog onOpenChange={onOpenChange} open={open} title="Tambah Penghuni" description="Isi detail penghuni yang akan ditambahkan.">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <DiFormField
            id="name"
            label="Nama"
            register={register}
            rules={{ required: "Nama harus diisi" }}
            error={errors.name}
          />
          <DiFormField
            id="phone"
            label="Nomor Telepon"
            register={register}
            rules={{ required: "nomor telepon harus diisi" }}
            error={errors.phone}
          />
          {/* resident status */}
            <DiFormSelect 
                id={"resident_status"}
                label={"Status"}
                control={control}
                rules={{required: "status harus dipilih"}}
                placeholder="Pilih status"
            >
                <SelectItem value="permanent">Tetap</SelectItem>
                <SelectItem value="contract">Kontrak</SelectItem>
            </DiFormSelect>
          
          {/* is maried */}
            <DiFormSelect 
                id={"is_married"}
                label={"Sudah menikah ?"}
                control={control}
                rules={{required: "Kolom ini harus diisi"}}
                placeholder="Pilih status"
            >
                <SelectItem value="1">Menikah</SelectItem>
                <SelectItem value="0">Belum Menikah</SelectItem>
            </DiFormSelect>

            <div className="space-y-2">
                <Label htmlFor="identity_card">Ktp</Label>
                <Input 
                    id="identity_card" 
                    type="file"
                    accept="image/*"
                    {...register("identity_card", {
                        required: "KTP harus diupload",
                        onChange: handleImageChange
                    })}
                />
                            {errors.identity_card && (
              <p className="text-sm text-red-500">{errors.identity_card.message}</p>
            )}
            {imagePreview && (
              <div className="mt-2">
                <img 
                  src={imagePreview} 
                  alt="Preview KTP" 
                  className="max-h-40 rounded-md object-contain"
                />
              </div>
            )}
            </div>
            {/* input image */}
          <Button type="submit" className="w-full">
            Tambah Penghuni
          </Button>
        </form>

    </DiFormDialog>
  );
};

export default AddOcupantDialog;
