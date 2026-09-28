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

