import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

const languages = [
  { id: "ru", title: "Russian" },
  { id: "en", title: "English", isDefault: true }
];

export const i18n = {
  languages,
  base: languages.find(item => item.isDefault)?.id
};

export const locales = languages?.map(el => el.id);
export const defaultLocale = languages?.find(el => el.isDefault)?.id || "en";

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) {
    notFound();
  }

  return {
    messages: undefined
  };
});
