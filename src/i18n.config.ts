// Here we set English as the default language
const languages = [
  { id: 'ru', title: 'Russian' },
  { id: 'en', title: 'English', isDefault: true },
];

const i18n = {
  languages,
  base: languages.find((item) => item.isDefault)?.id,
};

export { i18n };