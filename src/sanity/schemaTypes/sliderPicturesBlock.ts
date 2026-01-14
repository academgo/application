import { defineType, defineField } from "sanity";

const sliderPicturesBlock = defineType({
  name: "sliderPicturesBlock",
  title: "Slider Pictures Block",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string"
    }),
    defineField({
      name: "slides",
      title: "Slides",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image"
            }),
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string"
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string"
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "string"
            })
          ]
        }
      ]
    })
  ]
});

export default sliderPicturesBlock;
