// schemaTypes/videosBlock.ts
import { defineField, defineArrayMember } from "sanity";

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
      of: [
        defineArrayMember({
          type: "object",
          name: "videoItem",
          fields: [
            defineField({ name: "videoId", title: "Video ID", type: "string" }),
            defineField({
              name: "posterImage",
              title: "Poster Image",
              type: "image"
            }),
            defineField({ name: "date", title: "Date", type: "string" }),
            defineField({ name: "title", title: "Title", type: "string" })
          ]
        })
      ]
    })
  ]
};

export default videosBlock;
