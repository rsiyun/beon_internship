import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "../ui/label";
import { Controller } from "react-hook-form";

const DiFormSelect =({label, id, control, rules, error, placeholder, children}) => {
  return (
    <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <Controller 
            name={id}
            control={control}
            rules={rules}
            render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{label}</SelectLabel>
                        {children}
                    </SelectGroup>
                </SelectContent>
            </Select>
            )}
        />
        {error && (
        <p className="text-sm text-red-500">{error.message}</p>
      )}
    </div>
);
}
export default DiFormSelect;
