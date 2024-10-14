import { defineType, defineField } from "sanity";

const doubleTextBlock = defineType({
  name: "doubleTextBlock",
  title: "Double Text Block",
  type: "object",
  fields: [
    defineField({
      name: "doubleTextBlockTitle",
      title: "Title of the block (optional)",
      type: "string",
      description:
        "This title will be displayed above the text blocks. If you don't need it, just leave it empty."
    }),
    defineField({
      name: "leftTextBlock",
      title: "Text on the left",
      type: "contentBlock"
    }),
    defineField({
      name: "rightTextBlock",
      title: "Text on the right",
      type: "contentBlock"
    })
  ]
});

export default doubleTextBlock;
