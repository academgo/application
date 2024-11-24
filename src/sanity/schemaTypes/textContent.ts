import { defineType, defineField } from "sanity";

const textContent = defineType({
  name: "textContent",
  title: "Text Content Block",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string"
    }),
    defineField({
      name: "content",
      title: "Content Editor",
      type: "contentBlock"
    }),
    defineField({
      name: "marginBottom",
      title: "Margin Bottom",
      type: "string",
      options: {
        list: [
          { title: "Small", value: "small" },
          { title: "Medium", value: "medium" },
          { title: "Large", value: "large" }
        ]
      },
      description: "Select the margin size (small, medium, large)."
    })
  ]
});

export default textContent;
