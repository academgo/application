import { defineType, defineField } from "sanity";

const textContent = defineType({
  name: "textContent",
  title: "Text Content Block",
  type: "object",
  fields: [
    defineField({
      name: "content",
      title: "Content Editor",
      type: "contentBlock"
    })
  ]
});

export default textContent;
