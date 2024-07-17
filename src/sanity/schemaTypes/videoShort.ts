import { defineField } from "sanity";

const videoShort = {
  name: "videoShort",
  title: "Video Short",
  type: "object",
  fields: [
    defineField({
      name: "videoId",
      title: "Video ID",
      type: "string"
    }),
    defineField({
      name: "posterImage",
      title: "Poster Image",
      type: "image"
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "string"
    })
  ]
};

export default videoShort;
