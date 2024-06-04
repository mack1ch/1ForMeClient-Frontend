import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Select,
  Switch,
  TimePicker,
} from "antd";
import styles from "./ui.module.scss";
import {
  customFilterOption,
  customFilterSort,
  disabledDate,
  formatDateToDayAndDateFormat,
  numberToOrdinal,
} from "../model";
import InputMask from "react-input-mask";
import { useEffect, useState } from "react";
import { IFormData, ISelectOptions, ITrainings } from "../interface";
import { getSlots, postSubscription } from "../api";
import { ITariff } from "@/shared/interface/tariff";
import { convertToCurrencyFormat } from "@/shared/lib/parse/money";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { IClubSlot } from "@/shared/interface/slots";
import { formatTelNumber } from "@/shared/lib/parse/phone";
import useSWR from "swr";
import { IChatTypes } from "@/shared/interface/chat";
import { fetcher } from "@/shared/api";
import { IClub } from "@/shared/interface/club";
import { IStudio } from "@/shared/interface/studio";
import { IUser } from "@/shared/interface/user";

export const CreateSubscription = () => {
  const dateFormat = "DD.MM.YYYY";
  const router = useRouter();
  const [isButtonLoading, setButtonLoading] = useState<boolean>(false);
  const [isButtonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [chatTypesOptions, setChatTypesOptions] = useState<ISelectOptions[]>();
  const [selectTariff, setSelectTariff] = useState<ITariff>();
  const [trainings, setTrainings] = useState<ITrainings[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<{
    [key: string]: number | null;
  }>({});
  const [trainingSlots, setTrainingSlots] = useState<IClubSlot[][]>([]);
  const [formData, setFormData] = useState<IFormData>({
    tariffID: null,
    clubID: null,
    userChatTypeID: "",
    userName: "",
    userPhone: "",
    studioID: "",
    trainerID: "",
  });

  const [selectClubsOptions, setSelectClubsOptions] =
    useState<ISelectOptions[]>();
  const [selectStudiosOptions, setSelectStudiosOptions] =
    useState<ISelectOptions[]>();
  const [selectTariffOptions, setSelectTariffsOptions] =
    useState<ISelectOptions[]>();
  const [trainerSelectOptions, setTrainersSelectOptions] =
    useState<ISelectOptions[]>();
  const { data: chatTypes } = useSWR<IChatTypes[], Error>(
    "/chat-types",
    fetcher
  );
  const { data: users } = useSWR<IUser[], Error>(
    "/users?role=trainer",
    fetcher
  );
  const { data: tariffs } = useSWR<ITariff[], Error>(
    formData.studioID
      ? `/studios/byId/${formData.studioID}/tariffs?isForSubscription=1`
      : "",
    fetcher
  );
  const { data: studios } = useSWR<IStudio[], Error>("/studios/", fetcher);
  const { data: clubs } = useSWR<IClub[], Error>(
    formData.studioID ? `/studios/${formData.studioID}/clubs` : "",
    fetcher
  );

  useEffect(() => {
    if (chatTypes) {
      setChatTypesOptions(
        chatTypes.map((chatType) => ({
          label: chatType.name.toString(),
          value: chatType.id.toString(),
        }))
      );
    }
    if (users) {
      setTrainersSelectOptions(
        users.map((user) => ({
          label: user.name + " " + user.surname,
          value: user.id.toString(),
        }))
      );
    }
    if (clubs) {
      setSelectClubsOptions(
        clubs.map((club) => ({
          label: club.address + " / " + club.name,
          value: club.id.toString(),
        }))
      );
    }
    if (studios) {
      setSelectStudiosOptions(
        studios.map((studio) => ({
          label: studio.name + " / " + studio.address,
          value: studio.id.toString(),
        }))
      );
    }
    if (tariffs) {
      setSelectTariffsOptions(
        tariffs.map((item) => ({
          label: item.name,
          value: item.id.toString(),
        }))
      );
    }
  }, [chatTypes, clubs, tariffs, studios]);

  useEffect(() => {
    setTrainings((prevTrainings) =>
      prevTrainings.slice(0, selectTariff?.trainingAmount || 0)
    );
    setSelectedSlots((prevSelectedSlots) => {
      const newSelectedSlots = { ...prevSelectedSlots };
      Object.keys(newSelectedSlots).forEach((date) => {
        if (!trainings.find((training) => training.date === date)) {
          delete newSelectedSlots[date];
        }
      });
      return newSelectedSlots;
    });
  }, [selectedSlots]);

  const handleSelectChange = (key: keyof IFormData) => (value: string) => {
    if (key === "tariffID") {
      const selectedTariff = tariffs?.find(
        (item) => item.id.toString() === value
      );
      setSelectTariff(selectedTariff);
    }
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSlotClick = (slotId: number, date: string) => {
    setSelectedSlots((prev) => ({ ...prev, [date]: slotId }));
  };

  const handleTrainingChange = async (
    index: number,
    value: dayjs.Dayjs | null,
    valueString: string,
    type: "date" | "time"
  ) => {
    setTrainings((prev) => {
      const newTrainings = [...prev];
      newTrainings[index] = {
        ...newTrainings[index],
        [type]: valueString,
        [`${type}Input`]: value,
      };
      return newTrainings;
    });

    if (type === "date" && valueString) {
      const slots = await getSlots(valueString, formData.clubID!);
      if (!(slots instanceof Error)) {
        setTrainingSlots((prev) => {
          const newSlots = [...prev];
          newSlots[index] = slots;
          return newSlots;
        });
      }
    }
  };

  const handleCreateSubscription = async () => {
    try {
      setButtonLoading(true);
      const response = await postSubscription(
        formData,
        trainings,
        selectedSlots
      );
      if (response instanceof Error) {
        message.error(
          "Неудалось выполнить запрос. Проверьте правильность введенных данных"
        );
      } else {
        router.push(`/`);
        message.success(
          `Абонемент успешно создан на ${formatDateToDayAndDateFormat(
            response.trainings[0].date.toString().toLowerCase()
          )}`
        );
      }
    } catch {
      message.error("Проблема на сервере, мы уже работаем над устранением");
    } finally {
      setButtonLoading(false);
    }
  };

  const isFormValid = (): boolean => {
    return !!formData.tariffID && !!formData.clubID;
  };

  useEffect(() => {
    setButtonDisabled(!isFormValid());
  }, [formData]);

  const handleInputChange = (
    name: keyof IFormData,
    value: string | number | null
  ) => {
    if (name === "userPhone") {
      setFormData((prev) => ({
        ...prev,
        [name]: formatTelNumber(value?.toString()),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const currentMessengerLabel = chatTypesOptions?.find(
    (option) => option.value === formData.userChatTypeID
  );
  return (
    <>
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

          <Form.Item label="Студия:" style={{ width: "100%" }}>
            <Select
              onChange={handleSelectChange("studioID")}
              options={selectStudiosOptions}
              filterOption={customFilterOption}
              filterSort={customFilterSort}
              size="large"
              showSearch
              placeholder="Выберите студию"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item label="Зал:" style={{ width: "100%" }}>
            <Select
              onChange={handleSelectChange("clubID")}
              options={selectClubsOptions}
              filterOption={customFilterOption}
              filterSort={customFilterSort}
              showSearch
              size="large"
              placeholder="Выберите зал"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item label="Тренера:" style={{ width: "100%" }}>
            <Select
              onChange={handleSelectChange("trainerID")}
              options={trainerSelectOptions}
              filterOption={customFilterOption}
              filterSort={customFilterSort}
              showSearch
              size="large"
              placeholder="Выберите тренера"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item label="Тариф:" style={{ width: "100%" }}>
            <Select
              onChange={handleSelectChange("tariffID")}
              options={selectTariffOptions}
              filterOption={customFilterOption}
              filterSort={customFilterSort}
              size="large"
              showSearch
              value={
                selectTariff
                  ? selectTariff?.name +
                    " / " +
                    selectTariff?.trainingAmount +
                    " тренировок"
                  : undefined
              }
              placeholder="Выберите тариф"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <div className={styles.subscriptionCostLayout}>
            <label className={styles.label}>Стоимость абонемента:</label>
            <p className={styles.cost}>
              {selectTariff?.cost &&
                convertToCurrencyFormat(selectTariff?.cost.toString() || "")}
              {selectTariff?.cost && " ₽"}
            </p>
          </div>

          {selectTariff?.trainingAmount && (
            <Divider style={{ margin: "8px 0" }} />
          )}
          <div className={styles.trainingsWrap}>
            {Array.from(
              { length: selectTariff?.trainingAmount || 0 },
              (_, index) => (
                <div key={index} className={styles.trainingsLayout}>
                  <label className={styles.label}>{`${numberToOrdinal(
                    index + 1
                  )} занятие:`}</label>

                  <div className={styles.inputLayout}>
                    <DatePicker
                      inputReadOnly
                      disabledDate={disabledDate}
                      format={dateFormat}
                      style={{ width: "100%" }}
                      size="large"
                      placeholder="Выберите дату"
                      value={trainings[index]?.dateInput || null}
                      onChange={(date, dateString) => {
                        if (!Array.isArray(dateString)) {
                          handleTrainingChange(index, date, dateString, "date");
                        }
                      }}
                    />
                  </div>
                  <div className={styles.slotsWrap}>
                    {trainingSlots[index]
                      ?.filter((slot) => slot.isAvailable)
                      .map((slot) => (
                        <button
                          key={slot.id}
                          className={styles.slot}
                          onClick={() =>
                            handleSlotClick(
                              slot.id,
                              trainings[index].date || ""
                            )
                          }
                          style={{
                            backgroundColor:
                              slot.id ===
                              selectedSlots[trainings[index].date || ""]
                                ? "#000"
                                : "",
                            color:
                              slot.id ===
                              selectedSlots[trainings[index].date || ""]
                                ? "#fff"
                                : "",
                          }}
                        >
                          {slot.beginning}
                        </button>
                      ))}
                  </div>
                </div>
              )
            )}
          </div>
          <Button
            disabled={isButtonDisabled}
            loading={isButtonLoading}
            onClick={handleCreateSubscription}
            htmlType="submit"
            style={{ width: "100%", marginTop: "12px" }}
            type="primary"
            size="large"
          >
            Сохранить
          </Button>
        </div>
      </Form>
    </>
  );
};
