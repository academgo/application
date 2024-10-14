import { defineArrayMember, defineType, defineField } from "sanity";

export default defineType({
  name: "contentBlock",
  title: "Content Block",
  type: "array",
  of: [
    defineArrayMember({
      title: "Block",
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H1", value: "h1" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" }
      ],
      lists: [{ title: "Bullet", value: "bullet" }],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" }
        ],
        annotations: [
          {
            title: "URL",
            name: "link",
            type: "object",
            fields: [
              {
                title: "URL",
                name: "href",
                type: "url"
              }
            ]
          },
          {
            title: "Text Color",
            name: "color",
            type: "object",
            fields: [
              {
                title: "Color",
                name: "color",
                type: "string",
                description: "Input color code (e.g., #ff0000 for red)"
              }
            ]
          },
          {
            title: "Text Size",
            name: "textSize",
            type: "object",
            fields: [
              {
                title: "Size",
                name: "size",
                type: "string",
                description: "Input size (e.g., 16px, 1.5rem)"
              }
            ]
          }
        ]
      }
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string"
        })
      ]
    })
  ]
});
