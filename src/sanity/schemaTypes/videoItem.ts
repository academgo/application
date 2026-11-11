// schemaTypes/videoItem.ts
import { defineField } from "sanity";

/**
 * Одно видео в слайдере шортсов. Отдельным типом, потому что их два
 * потребителя: блок видео в конструкторе страниц и документ «Видеоотзывы».
 * Имя типа то же, что было у встроенного объекта, — данные совместимы.
 */
const videoItem = {
  name: "videoItem",
  title: "Видео",
  type: "object",
  fields: [
    defineField({
      name: "videoId",
      title: "Video ID",
      type: "string",
      description: "Идентификатор ролика на YouTube"
    }),
    defineField({
      name: "posterImage",
      title: "Poster Image",
      type: "image"
    }),
    defineField({ name: "date", title: "Date", type: "string" }),
    defineField({ name: "title", title: "Title", type: "string" })
  ],
  preview: {
    select: { title: "title", subtitle: "date", media: "posterImage" }
  }
};

export default videoItem;
