import { SelectProps } from "antd";
import { ISelectOptions } from "../interface";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";

export const customFilterOption: SelectProps<ISelectOptions>["filterOption"] = (
  input,
  option
) => {
  const inputValue = input.toLowerCase();
  const optionLabel = (option?.label ?? "").toString().toLowerCase();

  return optionLabel.includes(inputValue);
};

export const customFilterSort: SelectProps<ISelectOptions>["filterSort"] = (
  optionA,
  optionB
) =>
  ((optionA?.label ?? "") as string)
    .toLowerCase()
    .localeCompare((optionB?.label ?? "") as string);

export function findOptionById(
  id: string | null,
  options?: ISelectOptions[]
): ISelectOptions | undefined {
  return options?.find((option) => option.value == id);
}

export const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  return current && current < dayjs().startOf("day");
};

export function parseURLParams(input: string) {
  const [date, clubID, slotID, studioID, trainerID] = input
    .replace("slash", "/")
    .replace("slash", "/")
    .replace("slash", "/")
    .replace("slash", "/")
    .split("/");
  return {
    date,
    clubID: parseInt(clubID, 10),
    slotID: parseInt(slotID, 10),
    studioID: parseInt(studioID, 10),
    trainerID: parseInt(trainerID, 10),
  };
}

export function convertDateToDoteFormatDDMMYYYY(dateString: string): string {
  // Разбиваем строку на массив из частей [YYYY, MM, DD]
  const parts = dateString.split("-");

  // Проверяем, что массив содержит три части
  if (parts.length !== 3) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD.");
  }

  const [year, month, day] = parts;

  // Возвращаем дату в формате DD.MM.YYYY
  return `${day}.${month}.${year}`;
}

export function convertToMinutes(time?: string): number {
  if (!time) return 0;
  // Разделяем строку на часы и минуты
  const [hours, minutes] = time.split(":").map(Number);

  // Преобразуем часы в минуты и складываем с минутами
  return hours * 60 + minutes;
}
