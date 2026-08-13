const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/i;

export const isValidVIN = (vin: string) => {
  return VIN_REGEX.test(vin.trim());
};


export const isValidVehicleNumber = (value: string) => {
  const vehicleNumber = value.trim().toUpperCase();

  // 2–12 characters, letters/numbers with optional spaces or hyphens
  return /^[A-Z0-9][A-Z0-9 -]{1,11}$/.test(vehicleNumber);
};