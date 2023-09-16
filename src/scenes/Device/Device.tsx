import React, { useContext, useEffect, useState } from "react";
import StorageIcon from "@mui/icons-material/Storage";
import DeleteIcon from "@mui/icons-material/Delete";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { DevicesContext } from "../../context/DeviceProvider";
import SensorsIcon from "@mui/icons-material/Sensors";
import UpdateIcon from "@mui/icons-material/Update";
import FlexBetween from "@/components/FlexBetween";
import { tokens } from "@/theme";

interface DeviceProps {
  device: Device;
  onUpdate: (id: number, formFields: DeviceInputFields) => void;
}

function formatMac(mac: string) {
  if (!/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(mac)) {
    return mac.match(/.{1,2}/g)?.join(":");
  } else {
    return mac;
  }
}

const Device: React.FC<DeviceProps> = ({ device, onUpdate }) => {
  const { devices, setDevices } = useContext(DevicesContext);
  const [deviceStatus, setDeviceStatus] = useState<boolean>();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // const [shutdownLoading, setShutdownLoading] = useState<boolean>(false);
  // const [wakeLoading, setWakeLoading] = useState<boolean>(false);

  useEffect(() => {
    pingDevice();
  });

  async function sendWol() {
    // setWakeLoading(true);
    const response = await fetch(
      `http://${import.meta.env.VITE_API_HOST}/wol/${device.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const body = await response.json();

    if (body.message === "Magic packet sent") {
      let counter = 0;
      const intervalId = window.setInterval(async () => {
        const status = await pingDevice();

        if (status || counter >= 30) {
          // setWakeLoading(false);
          clearInterval(intervalId);
        }

        counter++;
      }, 2000);
    } else {
      // setWakeLoading(false);
    }
  }

  async function rmDevice() {
    const confirm = window.confirm(
      "Are you sure you want to delete this device?"
    );
    if (confirm) {
      const response = await fetch(
        `http://${import.meta.env.VITE_API_HOST}/devices/${device.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const body = await response.json();
      const deviceId = body.id;

      const deviceIndex = devices.findIndex((device) => {
        return device.id === deviceId;
      });

      const newDevices = [...devices];
      newDevices.splice(deviceIndex, 1);
      setDevices(newDevices);
    }
  }

  async function pingDevice() {
    const response = await fetch(
      `http://${import.meta.env.VITE_API_HOST}/ping/${device.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const body = await response.json();
    setDeviceStatus(body["status"]);

    return body["status"];
  }

  async function sendShutdown() {
    // setShutdownLoading(true);
    const confirm = window.confirm(
      "Are you sure you want to shutdown this device?"
    );
    if (confirm) {
      const response = await fetch(
        `http://${import.meta.env.VITE_API_HOST}/shutdown/${device.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const body = await response.json();

      if (new RegExp("closed by remote host").test(body["status"])) {
        console.log("turning off");

        let counter = 0;
        const intervalId = window.setInterval(async () => {
          const status = await pingDevice();

          if (!status || counter >= 60) {
            // setShutdownLoading(false);
            clearInterval(intervalId);
          }

          counter++;
        }, 2000);
      } else {
        // setShutdownLoading(false);
      }
    }
  }

  return (
    <FlexBetween
      border={`2px solid ${colors.gray[800]}`}
      borderRadius="0.5rem"
      m="0.5rem 0"
      p="0px 5px"
    >
      <StorageIcon sx={{ fontSize: "40px" }} />
      {device && (
        <Box>
          <Typography
            variant="h3"
            fontWeight="bold"
            color={colors.greenAccent[500]}
            sx={{ m: "0.2rem 0" }}
          >
            {device.devicename}
          </Typography>
          <Typography variant="h4" sx={{ m: "0.1rem 0" }}>
            {device.username + "@" + device.ip}
          </Typography>
          <Typography variant="h4" sx={{ m: "0.1rem 0" }}>
            {formatMac(device.mac)}
          </Typography>
        </Box>
      )}
      <IconButton onClick={deviceStatus ? sendShutdown : sendWol}>
        <PowerSettingsNewIcon
          sx={{ fontSize: 80 }}
          color={deviceStatus ? "success" : "error"}
        />
      </IconButton>
      <Box display="flex" flexDirection="column">
        <IconButton onClick={rmDevice}>
          <DeleteIcon />
        </IconButton>
        <IconButton
          onClick={() =>
            onUpdate(device.id, {
              username: device.username,
              devicename: device.devicename,
              ip: device.ip,
              mac: device.mac,
            })
          }
        >
          <UpdateIcon />
        </IconButton>
        <IconButton onClick={pingDevice}>
          <SensorsIcon />
        </IconButton>
      </Box>
    </FlexBetween>
  );
};

export default Device;
