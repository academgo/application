import { defineField } from "sanity";

/**
 * Блок «Направления» — плитка стран. Сам список стран берётся из раздела
 * Country (те, у которых включено Show on homepage), фото — из обложки
 * страницы-хаба, плашка поверх фото — из поля Home badge страны.
 *
 * Тип общий для главной и для обычных страниц. Поля редактируются только
 * на главной: вставленный в страницу блок берёт тексты оттуда и показывает
 * плитку один в один. Поэтому внутри страницы поля скрыты — пустые строки
 * выглядели как недоделанный блок и сбивали с толку.
 */

/**
 * На главной блок лежит полем документа, в странице — элементом массива.
 * Внутри страницы пустые поля прячем: они всё равно не используются.
 * Заполненное поле оставляем видимым — иначе правка пропадёт из виду.
 */
const insertedInPage = ({ parent, value }: any) =>
  Boolean(parent?._key) && (value === undefined || value === null || value === "");

const countriesBlock = {
  name: "countriesBlock",
  title: "Countries (destinations tile)",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: "Small line above the heading: «Направления» / «Destinations»",
      hidden: insertedInPage
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      hidden: insertedInPage
    }),
    defineField({
      name: "titleHighlight",
      title: "Title highlight",
      type: "string",
      hidden: insertedInPage
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      hidden: insertedInPage
    }),
    defineField({
      name: "cardLinkLabel",
      title: "Card link label",
      type: "string",
      description: "Link text inside a country card: «Подробнее» / «Learn more»",
      hidden: insertedInPage
    }),
    defineField({
      name: "compareLabel",
      title: "Compare link label",
      type: "string",
      hidden: insertedInPage
    }),
    defineField({
      name: "compareLink",
      title: "Compare link",
      type: "string",
      description: "Link to the countries comparison page",
      hidden: insertedInPage
    }),
    defineField({
      name: "ctaLabel",
      title: "Button label («Не знаю, куда хочу»)",
      type: "string",
      description:
        "Orange button under the tile. Opens the messenger popup — the same one as the button on the first screen, so it needs no link. Empty — no button",
      hidden: insertedInPage
    }),
    defineField({
      name: "maxCards",
      title: "How many countries to show",
      type: "number",
      initialValue: 6,
      description:
        "Cards are taken in Order, among the countries with Show on homepage enabled",
      validation: Rule => Rule.min(1).max(12),
      hidden: insertedInPage
    }),
    defineField({
      name: "allLabel",
      title: "All countries button label",
      type: "string",
      description:
        "Button under the tile: «Все страны» / «All destinations». Empty — no button",
      hidden: insertedInPage
    }),
    defineField({
      name: "allLink",
      title: "All countries link",
      type: "string",
      description: "Where the button under the tile leads",
      hidden: insertedInPage
    })
  ],
  preview: {
    select: { heading: "title", key: "_key" },
    prepare: (selection: Record<string, unknown>) => ({
      title: "Countries (destinations tile)",
      subtitle: selection.key
        ? "Texts and order — same as on the homepage"
        : (selection.heading as string) || "No heading"
    })
  }
};

export default countriesBlock;
