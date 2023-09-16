import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useTheme,
} from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { tokens } from "@/theme";

interface FormInputProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue?: any;
  options: option[];
}

const FormInputDropdown: React.FC<FormInputProps> = ({
  name,
  control,
  label,
  options,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const generateSingleOptions = () => {
    return options.map((option: option) => {
      return (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      );
    });
  };

  return (
    <FormControl fullWidth sx={{ color: colors.gray[500], m: "0.5rem 0" }}>
      <InputLabel>{label}</InputLabel>
      <Controller
        render={({ field: { onChange, value } }) => (
          <Select
            onChange={onChange}
            value={value}
            color="secondary"
            variant="standard"
          >
            {generateSingleOptions()}
          </Select>
        )}
        control={control}
        name={name}
      />
    </FormControl>
  );
};

export default FormInputDropdown;
