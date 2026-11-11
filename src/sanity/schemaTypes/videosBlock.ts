// schemaTypes/videosBlock.ts
import { defineField } from "sanity";

const videosBlock = {
  name: "videosBlock",
  title: "Videos Block",
  type: "object",
  fields: [
    defineField({
      name: "videosTitle",
      title: "Videos Title",
      type: "string"
    }),
    defineField({
      name: "videos",
      title: "Videos",
      type: "array",
      of: [{ type: "videoItem" }]
    })
  ]
};

export default videosBlock;
