import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const DiFormField = ({
  label,
  id,
  error,
  register,
  rules,
  type = "text",
  ...props
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input 
        id={id} 
        type={type}
        {...register(id, rules)}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};

export default DiFormField;