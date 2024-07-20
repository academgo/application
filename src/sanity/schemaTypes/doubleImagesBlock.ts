import { defineType, defineField } from "sanity";

const doubleImagesBlock = defineType({
  name: "doubleImagesBlock",
  title: "Double Images Block",
  type: "object",
  fields: [
    defineField({
      name: "leftImage",
      title: "Left Image",
      type: "image"
    }),
    defineField({
      name: "rightImage",
      title: "Right Image",
      type: "image"
    })
  ]
});

export default doubleImagesBlock;
