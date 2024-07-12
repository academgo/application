import { defineField } from "sanity";

const header = {
  name: "header",
  title: "Header",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Header title",
      type: "string"
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image"
    }),
    defineField({
      name: "logoMobile",
      title: "Logo mobile",
      type: "image"
    }),
    defineField({
      name: "logoMobileActive",
      title: "Logo mobile active",
      type: "image"
    }),
    defineField({
      name: "description",
      title: "Short description",
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
      name: "contactLinks",
      title: "Contact links",
      type: "array",
      description: "Links to messengers",
      of: [
        {
          type: "object",
          fields: [
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
      name: "languageIcon",
      title: "Language icon",
      type: "image",
      description: "Icon for language switcher"
    }),
    defineField({
      name: "languageLink",
      title: "Language link",
      type: "string",
      description: "Link to language switcher"
    }),
    defineField({
      name: "language",
      type: "string",
      initialValue: "id",
      readOnly: true
    })
  ]
};

export default header;
