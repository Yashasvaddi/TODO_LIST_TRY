import { useTranslation as useI18NextTranslation } from "react-i18next";

export const useTranslation = () => {
  const { t, i18n } = useI18NextTranslation();
  return { t, i18n };
};
