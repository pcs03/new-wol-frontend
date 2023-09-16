import { Control, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";

interface FormInputProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue?: any;
  password?: boolean;
}

const FormInputText = ({ name, control, label, password }: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          helperText={error ? error.message : null}
          size="small"
          error={!!error}
          onChange={onChange}
          value={value}
          fullWidth
          label={label}
          variant="outlined"
          color="secondary"
          sx={{ m: "0.5rem 0" }}
          type={password ? "password" : "text"}
        />
      )}
    />
  );
};

export default FormInputText;
