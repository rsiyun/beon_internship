import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import DiSelectSearch from "../atom/DiSelectSearch";

const DiFormSelectSearch = ({
  id,
  label,
  control,
  rules,
  options,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  error,
  onValueChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Controller
        name={id}
        control={control}
        rules={rules}
        render={({ field }) => (
          <DiSelectSearch
            options={options}
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);
              onValueChange?.(value);
            }}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
          />
        )}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default DiFormSelectSearch;