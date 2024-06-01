export const parsePhoneNumber = (phoneNumber?: string) => {
  if (!phoneNumber) return "";
  const cleanedNumber = phoneNumber.replace(/[^\d]/g, "");
  const formatted = `+${cleanedNumber[0]} (${cleanedNumber.slice(
    1,
    4
  )}) ${cleanedNumber.slice(4, 7)}-${cleanedNumber.slice(
    7,
    9
  )}-${cleanedNumber.slice(9, 11)}`;
  return formatted;
};

export function formatTelNumber(phone?: string): string {
  if (!phone) return "";
  return phone.startsWith("+") ? phone.substring(1) : phone;
}
