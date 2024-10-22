import { defineType, defineField } from "sanity";

const packagePriceBlock = defineType({
  name: "packagePriceBlock",
  title: "Package Price Block",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string"
    }),
    defineField({
      name: "leftSide",
      title: "Left side content",
      type: "blockContentWithStyle"
    }),
    defineField({
      name: "rightSide",
      title: "Right side",
      type: "object",
      fields: [
        defineField({
          name: "pretitle",
          title: "Pretitle",
          type: "string"
        }),
        defineField({
          name: "title",
          title: "Title",
          type: "string"
        }),
        defineField({
          name: "listTitle",
          title: "List title",
          type: "string"
        }),
        defineField({
          name: "list",
          title: "List",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "List title",
                  type: "string"
                })
              ]
            }
          ]
        }),
        defineField({
          name: "price",
          title: "Price",
          type: "string"
        }),
        defineField({
          name: "priceDescription",
          title: "Price description",
          type: "string"
        }),
        defineField({
          name: "buttonLabel",
          title: "Button label",
          type: "string"
        })
      ]
    })
  ]
});

export default packagePriceBlock;
