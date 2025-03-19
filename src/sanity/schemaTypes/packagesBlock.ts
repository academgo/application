import { defineType, defineField } from "sanity";

const packagesBlock = defineType({
  name: "packagesBlock",
  title: "Packages Block",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string"
    }),
    defineField({
      name: "priceBlock",
      title: "Price Block",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "preTitle",
              title: "Pretitle",
              type: "string"
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string"
            }),
            defineField({
              name: "itemsTitle",
              title: "Items Title",
              type: "string"
            }),
            defineField({
              name: "items",
              title: "Items",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "title",
                      title: "Title",
                      type: "string"
                    })
                  ]
                }
              ]
            }),
            defineField({
              name: "cost",
              title: "Cost",
              type: "string"
            }),
            defineField({
              name: "stageCost",
              title: "Stage Cost",
              type: "string"
            }),
            defineField({
              name: "buttonText",
              title: "Button Text",
              type: "string"
            }),
            defineField({
              name: "buttonLink",
              title: "Button Link",
              type: "string"
            }),
            defineField({
              name: "hasBorder",
              title: "Has Border",
              type: "boolean"
            }),
            defineField({
              name: "hasBg",
              title: "Has Background",
              type: "boolean"
            })
          ]
        }
      ]
    })
  ]
});

export default packagesBlock;
