import { defineType, defineField } from "sanity";

const cascadeBlock = defineType({
  name: "cascadeBlock",
  title: "Tile Text Block",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string"
    }),
    defineField({
      name: "contentCascadeBlocks",
      title: "Content Blocks",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "contentBlock",
              title: "Content Block",
              type: "blockContentWithStyle"
            })
          ]
        }
      ]
    })
  ]
});

export default cascadeBlock;
