import { defineType, defineField } from "sanity";

const blockContentWithStyle = defineType({
  name: "blockContentWithStyle",
  title: "Block Content with Style",
  type: "object",
  initialValue: {
    content: []
  },
  fields: [
    defineField({
      name: "content",
      title: "Content",
      type: "contentBlock" // Используем ваш существующий тип contentBlock для текстового контента
    }),
    defineField({
      name: "backgroundColor",
      title: "Background Color",
      type: "string",
      description:
        "Это не обязательный параметр. Это цвет фона текста. Его нужно вводить вручную в формате HEX. Если выбираем фон, то нужно выбрать и цвет текста, чтобы текст был виден на фоне. При выборе фона автоматически появляется внутренний отступ и закругленные углы"
    }),
    defineField({
      name: "isBorder",
      title: "Is Border",
      type: "boolean",
      description:
        "Это не обязательный параметр. Если выбран, то появляется рамка вокруг блока"
    })
  ]
});

export default blockContentWithStyle;
