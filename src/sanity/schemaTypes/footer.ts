import { defineField } from "sanity";

const footer = {
  name: "footer",
  title: "Footer",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string"
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image"
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "string"
    }),
    defineField({
      name: "workingHours",
      title: "Working hours",
      type: "string"
    }),
    defineField({
      name: "phoneNumber",
      title: "Phone number",
      type: "string",
      description: "Only numbers with spaces and special characters"
    }),
    defineField({
      name: "footerEmail",
      title: "Email",
      type: "string"
    }),
    defineField({
      name: "adress",
      title: "Adress",
      type: "string"
    }),
    defineField({
      name: "navLinks",
      title: "Navigation links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string"
            }),
            defineField({
              name: "link",
              title: "Link",
              type: "string"
            })
          ]
        }
      ]
    }),
    defineField({
      name: "contactLinksTitle",
      title: "Contact links title",
      type: "string"
    }),
    defineField({
      name: "contactLinks",
      title: "Contact links",
      type: "array",
      description: "Links to messengers",
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
    }),
    defineField({
      name: "buttonText",
      title: "Button text",
      type: "string"
    }),
    defineField({
      name: "copyright",
      title: "Copyright",
      type: "string"
    }),
    defineField({
      name: "privacyLink",
      title: "Privacy link",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          type: "string"
        }),
        defineField({
          name: "link",
          title: "Link",
          type: "string"
        })
      ]
    }),
    defineField({
      name: "language",
      type: "string",
      initialValue: "id",
      readOnly: true
    })
  ]
};

export default footer;
