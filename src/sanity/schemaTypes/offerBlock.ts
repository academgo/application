import { defineType, defineField } from "sanity";

const offerBlock = defineType({
  name: "offerBlock",
  title: "Offer Block",
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
      name: "blockContent",
      title: "Block Content",
      type: "blockContentWithStyle"
    }),
    defineField({
      name: "giftText",
      title: "Gift Text",
      type: "string"
    }),
    defineField({
      name: "offerDesctiption",
      title: "Offer Description",
      type: "string"
    }),
    defineField({
      name: "offerFormTitle",
      title: "Form Title",
      type: "string"
    }),
    defineField({
      name: "offerForm",
      title: "Offer Form",
      type: "reference", // Используйте ссылку на форму
      to: [{ type: "formStandardDocument" }]
    }),
    defineField({
      name: "offerButtonCustomText",
      title: "Button Text",
      type: "string"
    }),
    defineField({
      name: "offerAltText",
      title: "Alternate Text",
      type: "string"
    }),
    defineField({
      name: "offerContactLinks",
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
});

export default offerBlock;
