import { fetcher } from "@/shared/api";
import { IClub } from "@/shared/interface/club";
import { ITariff } from "@/shared/interface/tariff";
import { parseDateToDateAndMonth } from "@/shared/lib/parse/date";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { IFormData, ISelectOptions } from "../interface";
import { useRouter } from "next/navigation";
import { Button, Form, Input, message, notification, Select } from "antd";
import styles from "./ui.module.scss";
import InputMask from "react-input-mask";

import {
  convertDateToDoteFormatDDMMYYYY,
  convertToMinutes,
  customFilterOption,
  customFilterSort,
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

export const CreateTraining = ({ time }: { time: string }) => {
  const [api, contextHolder] = notification.useNotification();
  const URLParams = parseURLParams(time);
  const router = useRouter();
  const trainer = useAppSelector(
    (state) => state.availableTrainers.availableTrainers
  );
  const chosenTime = useAppSelector((state) => state.chosenTime.time);
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [formData, setFormData] = useState<IFormData>({
    date: URLParams.date,
    slotID: URLParams.slotID,
    dateInput: null,
    tariffID: null,
    clubID: URLParams.clubID,
    trainerID: trainer?.id || "",
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

    if (Array.isArray(clients)) {
      setSelectClientsOptions((prev) =>
        clients.map((client) => ({
          label: client.name + " " + client.surname,
          value: client.id.toString(),
        }))
      );
    }
  }, [clubs, formData.tariffID, tariffs, chatTypes, clients]);

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

  const handleTariffChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      tariffID: value,
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
    setIsButtonLoading(true);
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
          response.trainings[0].date
        );
        
        message.open({
          type: "success",
          content: `Тренировка создана. Ждём вас в ${dayOfWeek}, ${day} ${month.name}`,
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
    const { userName, userPhone, userChatTypeID, tariffID, date } = formData;
    return Boolean(userName && userPhone && userChatTypeID && tariffID);
  };
  useEffect(() => {
    setIsFormValid(checkFormValidity());
  }, [formData]);
  const { day, dayOfWeek, month } = parseDateToDateAndMonth(
    formData.date.toString()
  );
  return (
    <>
      {contextHolder}
      <Form style={{ width: "100%" }} name="validateOnly" layout="vertical">
        <div className={styles.formLayout}>
          <Form.Item
            name="userName"
            label="Ваше имя"
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
              placeholder="Имя"
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
            label="Услуга:"
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
              placeholder="Выберите услугу"
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

          {selectTariffInArray && (
            <Form.Item
              style={{
                width: "100%",
                textAlign: "start",
                alignItems: "flex-start",
              }}
            >
              <div className={styles.training}>
                <h4 className={styles.h4}>
                  {dayOfWeek}, {day} {month.name} | {chosenTime}
                </h4>
                <h4 className={styles.h4}>
                  {convertToMinutes(selectTariffInArray?.duration)} минут
                </h4>
                <h4 style={{ textWrap: "nowrap" }} className={styles.h4}>
                  {selectTariffInArray?.cost &&
                    convertToCurrencyFormat(
                      selectTariffInArray?.cost.toString() || ""
                    )}
                  {selectTariffInArray?.cost && " ₽"}
                </h4>
                <h4 style={{ fontWeight: "600" }} className={styles.h4}>
                  {findOptionById(
                    formData.clubID?.toString() || null,
                    selectClubsOptions
                  )?.label?.toString()}
                </h4>
                <h4 className={styles.h4}>
                  {trainer?.surname + " " + trainer?.name}
                </h4>
              </div>
            </Form.Item>
          )}
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
