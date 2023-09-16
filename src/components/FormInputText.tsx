import { Control, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material";
import { tokens } from "@/theme";

interface FormInputProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue?: any;
}
export const FormInputText = ({ name, control, label }: FormInputProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
          sx={{ color: colors.gray[500], m: "0.5rem 0" }}
        />
      )}
    />
  );
};
