import { fetcher } from "@/shared/api";
import { IClub } from "@/shared/interface/club";
import { ITariff } from "@/shared/interface/tariff";
import {
  convertDateFormatToDashFormat,
  parseDateToDateAndMonth,
} from "@/shared/lib/parse/date";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { IFormData, ISelectOptions } from "../interface";
import { useRouter } from "next/navigation";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  notification,
  Select,
  TimePickerProps,
} from "antd";
import styles from "./ui.module.scss";
import InputMask from "react-input-mask";
import { IClubSlot } from "@/shared/interface/slots";
import { dateFormatForDatePicker } from "../data";
import {
  convertDateToDoteFormatDDMMYYYY,
  customFilterOption,
  customFilterSort,
  disabledDate,
  findOptionById,
  parseURLParams,
} from "../model";
import { convertToCurrencyFormat } from "@/shared/lib/parse/money";
import dayjs from "dayjs";
import { formatTelNumber } from "@/shared/lib/parse/phone";
import { IChatTypes } from "@/shared/interface/chat";
import { useAppSelector } from "@/shared/redux/store";
import { IUser } from "@/shared/interface/user";
import { createTraining } from "../api";
import { ITraining } from "@/shared/interface/training";
export const CreateTraining = ({ time }: { time: string }) => {
  const [api, contextHolder] = notification.useNotification();
  const URLParams = parseURLParams(time);
  const router = useRouter();
  const availableTrainers = useAppSelector(
    (state) => state.availableTrainers.availableTrainers
  );
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [formData, setFormData] = useState<IFormData>({
    date: URLParams.date,
    slotID: URLParams.slotID,
    dateInput: null,
    tariffID: null,
    clubID: URLParams.clubID,
    trainerID: null,
    userChatTypeID: "",
    userName: "",
    userPhone: "",
    clients: undefined,
  });
  // Получаю тарифы персональных тренеровок
  const { data: tariffs } = useSWR<ITariff[], Error>(
    `/studios/byId/${URLParams.studioID}/tariffs?isForSubscription=0`,
    fetcher
  );

  // Получаю список всех залов
  const { data: clubs } = useSWR<IClub[], Error>("/clubs", fetcher);

  // Получаю слоты для выбранного слота и выбранной даты
  const { data: slots } = useSWR<IClubSlot[], Error>(
    formData.clubID && formData.date
      ? `/clubs/${formData.clubID}/slots?date=${convertDateFormatToDashFormat(
          formData.date.toString()
        )} `
      : null,
    fetcher
  );

  // Получаю всех клиентов
  const { data: clients } = useSWR<IUser[], Error>(
    "/users?role=client",
    fetcher
  );

  // Получаю типы чатов
  const { data: chatTypes } = useSWR<IChatTypes[], Error>(
    "/chat-types",
    fetcher
  );

  // Массивы Options для компонентов Select
  const [selectTariffsOptions, setSelectTariffsOptions] =
    useState<ISelectOptions[]>();
  const [selectTariffInArray, setSelectTariffInArray] = useState<ITariff>();
  const [chatTypesOptions, setChatTypesOptions] = useState<ISelectOptions[]>();
  const [selectAvailableTrainersOptions, setSelectAvailableTrainersOptions] =
    useState<ISelectOptions[]>();
  const [selectClubsOptions, setSelectClubsOptions] =
    useState<ISelectOptions[]>();
  const [selectClientsOptions, setSelectClientsOptions] =
    useState<ISelectOptions[]>();
  const currentMessengerLabel = chatTypesOptions?.find(
    (option) => option.value === formData.userChatTypeID
  );
  useEffect(() => {
    if (Array.isArray(tariffs)) {
      setSelectTariffsOptions((prev) =>
        tariffs?.map((item) => ({
          label: item.name,
          value: item.id.toString(),
        }))
      );
      setSelectTariffInArray(
        tariffs?.find((option) => option.id.toString() === formData.tariffID)
      );
    }
    if (Array.isArray(clubs)) {
      setSelectClubsOptions((prev) =>
        clubs?.map((club) => ({
          label: club.address + " / " + club.name,
          value: club.id.toString(),
        }))
      );
    }
    if (Array.isArray(chatTypes)) {
      setChatTypesOptions((prev) =>
        chatTypes.map((chatType) => ({
          label: chatType.name.toString(),
          value: chatType.id.toString(),
        }))
      );
    }
    if (Array.isArray(availableTrainers)) {
      setSelectAvailableTrainersOptions((prev) =>
        availableTrainers.map((availableTrainer) => ({
          label: availableTrainer.name + " " + availableTrainer.surname,
          value: availableTrainer.id.toString(),
        }))
      );
    }
    if (Array.isArray(clients)) {
      setSelectClientsOptions((prev) =>
        clients.map((client) => ({
          label: client.name + " " + client.surname,
          value: client.id.toString(),
        }))
      );
    }
  }, [
    clubs,
    formData.tariffID,
    tariffs,
    chatTypes,
    availableTrainers,
    clients,
  ]);

  // date reload
  useEffect(() => {
    if (URLParams.date) {
      setFormData((prev) => ({
        ...prev,
        dateInput: dayjs(
          convertDateToDoteFormatDDMMYYYY(URLParams.date),
          "DD.MM.YYYY"
        ),
      }));
    }
  }, [URLParams.date]);
  // handleChange
  const handleDateChange: TimePickerProps["onChange"] = (date, dateString) => {
    setFormData((prev) => ({
      ...prev,
      date: dateString,
      dateInput: date,
    }));
  };
  const handleSlotSelection = (slotID: number) => {
    setFormData((prev) => ({
      ...prev,
      slotID: slotID,
    }));
  };
  const handleTariffChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      tariffID: value,
    }));
  };
  const handleClubChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      clubID: value,
    }));
  };
  const handleTrainerChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      trainerID: value,
    }));
  };
  const handleClientChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      clients: value,
    }));
  };
  const handleInputChange = (name: string, value: string | number | null) => {
    if (name === "userPhone") {
      setFormData((prevValues) => ({
        ...prevValues,
        [name]: formatTelNumber(value?.toString()),
      }));
    } else {
      setFormData((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  // Создание тренировки POST
  const handleCreateTraining = async () => {
    try {
      const response = await createTraining(formData);
      if (response instanceof Error) {
        message.open({
          type: "error",
          content: "Неудалось выполнить запрос",
        });
        setIsButtonLoading(false);
        return;
      } else {
        const { day, dayOfWeek, month } = parseDateToDateAndMonth(
          response[0].date
        );
        api["success"]({
          message: "Тренировка создана",
          description: `Ждём вас в ${dayOfWeek}, ${day} ${month.name}`,
        });
        router.push("/");
      }
      setIsButtonLoading(false);
    } catch {
      setIsButtonLoading(false);
      message.open({
        type: "error",
        content: "Неудалось выполнить запрос",
      });
    }
  };

  // Валидация
  const checkFormValidity = () => {
    const {
      userName,
      userPhone,
      userChatTypeID,
      tariffID,
      clubID,
      trainerID,
      date,
      slotID,
    } = formData;
    return Boolean(
      userName &&
        userPhone &&
        userChatTypeID &&
        tariffID &&
        clubID &&
        trainerID &&
        date &&
        slotID
    );
  };
  useEffect(() => {
    setIsFormValid(checkFormValidity());
  }, [formData]);
  return (
    <>
      {contextHolder}
      <Form style={{ width: "100%" }} name="validateOnly" layout="vertical">
        <div className={styles.formLayout}>
          <Form.Item
            name="userName"
            label="Имя и фамилия"
            style={{
              width: "100%",
              textAlign: "start",
              alignItems: "flex-start",
            }}
          >
            <Input
              value={formData?.userName}
              size="large"
              onChange={(e) => handleInputChange("userName", e.target.value)}
              placeholder="Имя и фамилия"
            />
          </Form.Item>
          <Form.Item
            name="userPhone"
            label="Номер телефона"
            style={{
              width: "100%",
              textAlign: "start",
              alignItems: "flex-start",
            }}
          >
            <InputMask
              mask="+79999999999"
              maskChar={null}
              type="tel"
              value={formData?.userPhone}
              onChange={(e) => handleInputChange("userPhone", e.target.value)}
            >
              {
                //@ts-ignore
                (inputProps) => (
                  <Input
                    type="number"
                    placeholder="Номер телефона"
                    size="large"
                    maxLength={12}
                    {...inputProps}
                  />
                )
              }
            </InputMask>
          </Form.Item>
          <Form.Item
            name="userChatTypeID"
            label="Удобный мессенджер"
            style={{
              width: "100%",
              textAlign: "start",
              alignItems: "flex-start",
            }}
          >
            <Select
              options={chatTypesOptions}
              value={formData.userChatTypeID}
              onChange={(e) => handleInputChange("userChatTypeID", e)}
              placeholder="Мессенджер"
              size="large"
            />
          </Form.Item>
          {(currentMessengerLabel?.label === "Telegram" ||
            currentMessengerLabel?.label === "Instagram") && (
            <Form.Item
              style={{
                width: "100%",
                textAlign: "start",
                marginTop: "-8px",
                alignItems: "flex-start",
              }}
              name="userNameInMessenger"
            >
              <Input
                value={formData.userNameInMessenger}
                onChange={(e) =>
                  handleInputChange("userNameInMessenger", e.target.value)
                }
                placeholder={`Имя пользователя в формате @username`}
                size="large"
              />
            </Form.Item>
          )}
          <Form.Item
            label="Тариф:"
            style={{
              width: "100%",
              textAlign: "start",
              alignItems: "flex-start",
            }}
          >
            <Select
              size="large"
              style={{ width: "100%" }}
              showSearch
              onChange={handleTariffChange}
              filterOption={customFilterOption}
              filterSort={customFilterSort}
              options={selectTariffsOptions}
              placeholder="Выберите тариф"
            />
          </Form.Item>
          {selectTariffInArray?.name.toLowerCase().includes("сплит") ? (
            <Form.Item
              label="Выберите пару:"
              style={{
                width: "100%",
                textAlign: "start",
                alignItems: "flex-start",
              }}
            >
              <Select
                size="large"
                mode="multiple"
                style={{ width: "100%" }}
                showSearch
                filterOption={customFilterOption}
                filterSort={customFilterSort}
                onChange={handleClientChange}
                options={selectClientsOptions}
                maxCount={
                  selectTariffInArray?.clientsAmount
                    ? selectTariffInArray.clientsAmount - 1
                    : undefined
                }
                placeholder="Выберите пару"
              />
            </Form.Item>
          ) : undefined}
          <Form.Item
            label="Тренер:"
            style={{
              width: "100%",
              textAlign: "start",
              alignItems: "flex-start",
            }}
          >
            <Select
              size="large"
              style={{ width: "100%" }}
              showSearch
              onChange={handleTrainerChange}
              filterOption={customFilterOption}
              filterSort={customFilterSort}
              options={selectAvailableTrainersOptions}
              placeholder="Выберите тренера"
            />
          </Form.Item>
          <Form.Item
            label="Зал:"
            style={{
              width: "100%",
              textAlign: "start",
              alignItems: "flex-start",
            }}
          >
            <Select
              style={{ width: "100%" }}
              showSearch
              value={findOptionById(
                formData.clubID?.toString() || null,
                selectClubsOptions
              )?.label?.toString()}
              filterOption={customFilterOption}
              filterSort={customFilterSort}
              onChange={handleClubChange}
              options={selectClubsOptions}
              size="large"
              placeholder="Выберите зал"
            />
          </Form.Item>
          <Form.Item
            label="Дата:"
            style={{
              width: "100%",
              textAlign: "start",
              alignItems: "flex-start",
            }}
          >
            <DatePicker
              size="large"
              onChange={handleDateChange}
              format={dateFormatForDatePicker}
              inputReadOnly
              disabledDate={disabledDate}
              value={formData.dateInput}
              placeholder="Дата тренировки"
              style={{ width: "100%", fontSize: "16px" }}
            />
          </Form.Item>
          {slots && (
            <div className={styles.slotWrap}>
              {slots?.map((slot) => {
                if (slot.isAvailable) {
                  return (
                    <button
                      onClick={() => handleSlotSelection(slot.id)}
                      key={slot.id}
                      style={{
                        background: formData.slotID === slot.id ? "#000" : "",
                        color: formData.slotID === slot.id ? "#fff" : "",
                      }}
                      className={styles.slot}
                    >
                      {slot.beginning}
                    </button>
                  );
                }
                return null;
              })}
            </div>
          )}

          <div className={styles.trainingCostLayout}>
            <label className={styles.label}>Стоимость тренировки:</label>
            <p className={styles.cost}>
              {selectTariffInArray?.cost &&
                convertToCurrencyFormat(
                  selectTariffInArray?.cost.toString() || ""
                )}
              {selectTariffInArray?.cost && " ₽"}
            </p>
          </div>
          <Form.Item
            style={{
              width: "100%",
              textAlign: "start",
              alignItems: "flex-start",
            }}
          >
            <Button
              onClick={handleCreateTraining}
              disabled={!isFormValid}
              loading={isButtonLoading}
              htmlType="submit"
              style={{ width: "100%" }}
              type="primary"
              size="large"
            >
              Сохранить
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  );
};
