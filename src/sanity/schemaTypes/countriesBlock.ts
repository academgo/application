import { defineField } from "sanity";

/**
 * Блок «Направления» — плитка стран. Сам список стран берётся из раздела
 * Country (те, у которых включено Show on homepage), фото — из обложки
 * страницы-хаба, плашка поверх фото — из поля Home badge страны.
 *
 * Тип общий для главной и для обычных страниц. На странице поля можно не
 * заполнять: пустой блок возьмёт тексты с главной того же языка, и плитка
 * будет один в один как там. Заполненное поле перекрывает общее значение.
 */
const countriesBlock = {
  name: "countriesBlock",
  title: "Направления (плитка стран)",
  type: "object",
  fields: [

      defineField({
        name: "eyebrow",
        title: "Eyebrow",
        type: "string",
        description:
          "Короткая надпись над заголовком: «Направления» / «Destinations»"
      }),
      defineField({
        name: "title",
        title: "Title",
        type: "string"
      }),
      defineField({
        name: "titleHighlight",
        title: "Title highlight",
        type: "string"
      }),
      defineField({
        name: "description",
        title: "Description",
        type: "text",
        rows: 3
      }),
      defineField({
        name: "cardLinkLabel",
        title: "Card link label",
        type: "string",
        description:
          "Текст ссылки в карточке страны: «Подробнее» / «Learn more»"
      }),
      defineField({
        name: "compareLabel",
        title: "Compare link label",
        type: "string"
      }),
      defineField({
        name: "compareLink",
        title: "Compare link",
        type: "string",
        description: "Ссылка на страницу сравнения стран"
      }),
      defineField({
        name: "ctaLabel",
        title: "Кнопка «Не знаю, куда хочу»",
        type: "string",
        description:
          "Оранжевая кнопка под плиткой. Открывает всплывающее окно с мессенджерами — то же, что и кнопка на первом экране, поэтому ссылка ей не нужна. Пусто — кнопка не показывается"
      }),
      defineField({
        name: "maxCards",
        title: "How many countries to show",
        type: "number",
        initialValue: 6,
        description:
          "Сколько карточек показывать в плитке. Берутся первые по полю Order среди тех, у кого включено Show on homepage",
        validation: Rule => Rule.min(1).max(12)
      }),
      defineField({
        name: "allLabel",
        title: "All countries button label",
        type: "string",
        description:
          "Текст кнопки под плиткой: «Все страны» / «All destinations». Пустое поле — кнопки нет"
      }),
      defineField({
        name: "allLink",
        title: "All countries link",
        type: "string",
        description: "Куда ведёт кнопка под плиткой"
      })
  ]
};

export default countriesBlock;
