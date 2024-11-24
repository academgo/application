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
      name: "leftContent",
      title: "Left Content",
      type: "object",
      fields: [
        defineField({
          name: "type",
          title: "Type",
          type: "string",
          options: {
            list: [
              { title: "Text", value: "text" },
              { title: "Image", value: "image" }
            ]
          }
        }),
        defineField({
          name: "blockContent",
          title: "Block Content",
          type: "blockContentWithStyle",
          hidden: ({ parent }) => parent?.type !== "text"
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          hidden: ({ parent }) => parent?.type !== "image"
        })
      ]
    }),
    defineField({
      name: "rightContent",
      title: "Right Content",
      type: "object",
      fields: [
        defineField({
          name: "type",
          title: "Type",
          type: "string",
          options: {
            list: [
              { title: "Text", value: "text" },
              { title: "Image", value: "image" }
            ]
          }
        }),
        defineField({
          name: "blockContent",
          title: "Block Content",
          type: "blockContentWithStyle",
          hidden: ({ parent }) => parent?.type !== "text"
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          hidden: ({ parent }) => parent?.type !== "image"
        })
      ]
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

export default doubleTextBlock;
