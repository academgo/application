// Here we set English as the default language
const languages = [
  { id: 'en', title: 'English', isDefault: true },
  { id: 'ru', title: 'Russian' },
];

const i18n = {
  languages,
  base: languages.find((item) => item.isDefault)?.id,
};

export { i18n };