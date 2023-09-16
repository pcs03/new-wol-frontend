import { Dispatch, SetStateAction, createContext, useState } from "react";
import { ReactNode } from "react";

interface DevicesContextInterface {
  devices: Device[];
  setDevices: Dispatch<SetStateAction<Device[]>>;
}

export const DevicesContextDefault: DevicesContextInterface = {
  devices: [],
  setDevices: () => [],
};

export const DevicesContext = createContext<DevicesContextInterface>(
  DevicesContextDefault
);

export const DevicesProvider = ({ children }: { children: ReactNode }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const value = { devices, setDevices };

  return (
    <>
      <DevicesContext.Provider value={value}>
        {children}
      </DevicesContext.Provider>
    </>
  );
};
