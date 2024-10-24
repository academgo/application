import { defineType, defineField } from "sanity";

const pricesBlock = defineType({
  name: "pricesBlock",
  title: "Prices Block",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string"
    }),
    defineField({
      name: "titleHighlight",
      title: "Title Highlight",
      type: "string"
    }),
    defineField({
      name: "parts",
      title: "Parts",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "partTitle",
              title: "Part Title",
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
            })
          ]
        }
      ]
    }),
    defineField({
      name: "packages",
      title: "Packages",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "packageTitle",
              title: "Package Title",
              type: "string"
            }),
            defineField({
              name: "packagePrice",
              title: "Package Price",
              type: "string"
            }),
            defineField({
              name: "packageDescription",
              title: "Package Description",
              type: "string"
            }),
            defineField({
              name: "packageLink",
              title: "Package Link",
              type: "object",
              fields: [
                defineField({
                  name: "label",
                  title: "Label",
                  type: "string"
                }),
                defineField({
                  name: "destination",
                  title: "Destination",
                  type: "string"
                })
              ]
            }),
            defineField({
              name: "packageItems",
              title: "Package Items",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "title",
                      title: "Title",
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
                              name: "trueOrFalse",
                              title: "True Or False",
                              type: "boolean"
                            })
                          ]
                        }
                      ]
                    })
                  ]
                }
              ]
            }),
            defineField({
              name: "packageButtonLabel",
              title: "Package Button Label",
              type: "string"
            }),
            defineField({
              name: "isPopular",
              title: "Is Popular",
              type: "boolean"
            }),
            defineField({
              name: "isHighlighted",
              title: "Is Highlighted",
              type: "boolean"
            })
          ]
        }
      ]
    })
  ]
});

export default pricesBlock;
