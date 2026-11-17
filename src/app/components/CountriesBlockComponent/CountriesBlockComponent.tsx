import React, { FC } from "react";
import CountriesSection from "../CountriesSection/CountriesSection";
import { CountriesBlock } from "@/types/homepage";
import {
  getCountriesBlockByLang,
  getCountriesByLang
} from "@/sanity/sanity.utils";

export type CountriesBlockType = CountriesBlock & {
  _key: string;
  _type: "countriesBlock";
};

type Props = {
  block: CountriesBlockType;
  lang: string;
};

/** Заполнено ли хоть одно поле блока, кроме служебных */
const hasOwnTexts = (block: CountriesBlockType) =>
  Object.entries(block).some(
    ([field, value]) =>
      !field.startsWith("_") &&
      value !== undefined &&
      value !== null &&
      value !== ""
  );

/**
 * Блок «Направления» на обычных страницах. Тот же компонент, что на
 * главной, — плитка выглядит и ведёт себя одинаково.
 *
 * Поля блока можно не заполнять: тогда он берёт тексты с главной страницы
 * того же языка. Так заголовок, подписи кнопок и число карточек остаются
 * в одном месте. Любое заполненное поле перекрывает общее значение.
 */
const CountriesBlockComponent: FC<Props> = async ({ block, lang }) => {
  const [countries, shared] = await Promise.all([
    getCountriesByLang(lang),
    hasOwnTexts(block) ? Promise.resolve(null) : getCountriesBlockByLang(lang)
  ]);

  const texts: CountriesBlock = shared ? { ...shared, ...block } : block;

  return (
    <CountriesSection
      block={texts}
      countries={countries}
      lang={lang}
      nested
    />
  );
};

export default CountriesBlockComponent;
