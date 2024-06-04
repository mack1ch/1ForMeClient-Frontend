import { SelectProps } from "antd";
import { ISelectOptions } from "../interface";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";

export const customFilterOption: SelectProps<ISelectOptions>["filterOption"] = (
  input,
  option
) => ((option?.label ?? "") as string).includes(input);

export const customFilterSort: SelectProps<ISelectOptions>["filterSort"] = (
  optionA,
  optionB
) =>
  ((optionA?.label ?? "") as string)
    .toLowerCase()
    .localeCompare((optionB?.label ?? "") as string);

export function formatDateToDayAndDateFormat(inputDate: string): string {
  const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  const dateParts = inputDate.split("-").map((part) => parseInt(part, 10));
  const [year, monthIndex, day] = dateParts;
  const date = new Date(year, monthIndex - 1, day);
  const dayOfWeek = daysOfWeek[date.getDay()];
  const month = months[monthIndex - 1];

  return `${dayOfWeek}, ${day} ${month}`;
}

export function numberToOrdinal(n: number): string {
  const units = [
    "",
    "первое",
    "второе",
    "третье",
    "четвёртое",
    "пятое",
    "шестое",
    "седьмое",
    "восьмое",
    "девятое",
  ];
  const tens = [
    "",
    "десятое",
    "двадцатое",
    "тридцатое",
    "сороковое",
    "пятидесятое",
    "шестидесятое",
    "семидесятое",
    "восьмидесятое",
    "девяностое",
  ];

  if (n < 1 || n > 99) {
    return "Число должно быть от 1 до 99";
  }

  if (n < 10) {
    return units[n];
  }

  const unit = n % 10;
  const ten = Math.floor(n / 10);

  return `${tens[ten]} ${units[unit]}`;
}

export const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  return current && current < dayjs().startOf("day");
};
