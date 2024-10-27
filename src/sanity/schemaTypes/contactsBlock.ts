import { defineType, defineField } from "sanity";

const contactsBlock = defineType({
  name: "contactsBlock",
  title: "Contacts Block",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string"
    }),
    defineField({
      name: "contactsContent",
      title: "Contacts Content",
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
              name: "type",
              title: "Type",
              type: "string",
              options: {
                list: [
                  { title: "Link", value: "link" },
                  { title: "Text", value: "string" }
                ]
              }
            }),
            defineField({
              name: "linkLabel",
              title: "Link Label",
              type: "string",
              hidden: ({ parent }) => parent?.type !== "link"
            }),
            defineField({
              name: "linkDestination",
              title: "Link Destination",
              type: "string",
              hidden: ({ parent }) => parent?.type !== "link"
            }),
            defineField({
              name: "text",
              title: "Text",
              type: "string",
              hidden: ({ parent }) => parent?.type !== "string"
            })
          ]
        }
      ]
    }),
    defineField({
      name: "socialDescription",
      title: "Social Description",
      type: "string"
    }),
    defineField({
      name: "socialIcons",
      title: "Social Icons",
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
              name: "icon",
              title: "Icon",
              type: "image"
            }),
            defineField({
              name: "link",
              title: "Link",
              type: "string"
            })
          ]
        }
      ]
    })
  ]
});

export default contactsBlock;
