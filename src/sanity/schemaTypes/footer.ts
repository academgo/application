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
    // cousultation block
    defineField({
      name: "consultationBlock",
      title: "Consultation Block",
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
          name: "listTitle",
          title: "List Title",
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
                  title: "List Item",
                  type: "string"
                })
              ]
            }
          ]
        }),
        defineField({
          name: "giftText",
          title: "Gift Text",
          type: "string"
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "string"
        }),
        defineField({
          name: "formTitle",
          title: "Form Title",
          type: "string"
        }),
        defineField({
          name: "form",
          title: "Form",
          type: "reference", // Используйте ссылку на форму
          to: [{ type: "formStandardDocument" }]
        }),
        defineField({
          name: "buttonCustomText",
          title: "Button Custom Text",
          type: "string"
        }),
        defineField({
          name: "altText",
          title: "Alternate Text",
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
        })
      ]
    }),
    // cousultation block
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
