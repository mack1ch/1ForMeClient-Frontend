import { ThemeConfig } from "antd";

export const globalContext: ThemeConfig = {
  token: {
    colorPrimary: "#E6F36C",
  },
  components: {
    Button: {
      colorPrimary: "#E6F36C",
      colorBgContainerDisabled: "#E3E3E3",
      colorTextDisabled: "rgba(0, 0, 0, 0.40)",
      colorPrimaryHover: "#E6F36C",
      colorPrimaryActive: "#ECFF3C",
      colorTextLightSolid: "#000",
      fontWeight: "600",
      primaryShadow: "none",
    },
    Input: {
      colorPrimaryHover: "#E6F36C",
      colorPrimary: "#E6F36C",
      activeShadow: "none",
    },
    DatePicker: {
      activeBorderColor: "#E6F36C",
      activeShadow: "none",
      fontSize: 16,
    },
    Select: {
      colorPrimary: "#E6F36C",
      controlOutline: "none",
    },
    Switch: {
      colorPrimary: "#E6F36C",
      colorPrimaryActive: "#E6F36C",
      colorPrimaryBg: "#e6f36c",
    },
  },
};
