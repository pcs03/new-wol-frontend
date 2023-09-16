import { useContext } from "react";
import { DevicesContext } from "../../context/DeviceProvider";
import { useForm } from "react-hook-form";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { FormInputText } from "@/components/FormInputText";
import { tokens } from "@/theme";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

interface DeviceInputProps {
  mode: "add" | "update";
  id?: number;
  formFields?: DeviceInputFields;
}

const defaultValues = {
  devicename: "",
  username: "",
  ip: "",
  mac: "",
};

const DeviceInput: React.FC<DeviceInputProps> = ({ mode, id, formFields }) => {
  const { devices, setDevices } = useContext(DevicesContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const usernamePattern = /^[a-z_]([a-z0-9_-]{0,31}|[a-z0-9_-]{0,30}\$)$/;
  const ipPattern = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
  const macPattern = /^([0-9A-Fa-f]{12}|([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2})$/;

  const userSchema = object({
    devicename: string().required("Required").max(15, "Too long"),
    username: string()
      .required("Required")
      .matches(usernamePattern, "Not a valid username"),
    mac: string()
      .required("Required")
      .matches(macPattern, "Not a valid MAC Address")
      .uppercase(),
    ip: string()
      .required("Required")
      .matches(ipPattern, "Not a valid IP Address"),
  });

  const { handleSubmit, control, reset } = useForm<DeviceInputFields>({
    resolver: yupResolver(userSchema),
    defaultValues: mode == "update" ? formFields : defaultValues,
  });

  async function addDevice(data: DeviceInputFields) {
    const response = await fetch(
      `http://${import.meta.env.VITE_API_HOST}/devices`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const body = await response.json();
    const newDevices = [...devices, body];

    setDevices(newDevices);
  }

  async function updateDevice(data: DeviceInputFields) {
    const response = await fetch(
      `http://${import.meta.env.VITE_API_HOST}/devices/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const body = await response.json();

    const newDevices = [...devices];
    const deviceIndex = newDevices.findIndex((device) => device.id === id);
    newDevices[deviceIndex] = body;

    setDevices(newDevices);
  }

  return (
    <Box>
      <Typography variant="h3" color={colors.greenAccent[500]} m="0.5rem 0">
        {mode == "add" ? "Add a New Device" : "Update Device"}
      </Typography>

      <FormInputText name="devicename" control={control} label="Device Name" />
      <FormInputText name="username" control={control} label="Username" />
      <FormInputText name="ip" control={control} label="IP Address" />
      <FormInputText name="mac" control={control} label="MAC Address" />

      <Button
        type="submit"
        onClick={
          mode == "add"
            ? handleSubmit((data: DeviceInputFields) => addDevice(data))
            : handleSubmit((data: DeviceInputFields) => updateDevice(data))
        }
        variant="contained"
        color="secondary"
        sx={{ m: "0.5rem 0" }}
      >
        {mode === "add" ? "Add Device" : "Update Device"}
      </Button>
      <Button
        onClick={() => reset()}
        variant="contained"
        color="secondary"
        sx={{ m: "0.5rem 0.5rem" }}
      >
        Reset
      </Button>
    </Box>
  );
};

export default DeviceInput;
