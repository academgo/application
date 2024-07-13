import { defineField, defineType } from "sanity";

export default defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string"
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "localizedSlug"
    }),
    defineField({
      name: "mainHeadingStart",
      title: "Main Heading Start",
      type: "string"
    }),
    defineField({
      name: "mainHeadingHighlight",
      title: "Main Heading Highlight",
      type: "string"
    }),
    defineField({
      name: "mainHeadingContinue",
      title: "Main Heading Continue",
      type: "string"
    }),
    defineField({
      name: "mainHeadingEnd",
      title: "Main Heading End",
      type: "string"
    }),
    defineField({
      name: "tooltip",
      title: "Tooltip",
      type: "string"
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string"
    }),
    defineField({
      name: "descriptionSmall",
      title: "Description Small",
      type: "string"
    }),
    defineField({
      name: "heroButtonText",
      title: "Hero Button Text",
      type: "string"
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image"
    }),
    defineField({
      name: "heroDescription",
      title: "Hero Description",
      type: "string"
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string"
    }),
    defineField({
      name: "flags",
      title: "Flags",
      type: "array",
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
              name: "image",
              title: "Image",
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
    // optional
    defineField({
      name: "language",
      type: "string",
      initialValue: "id",
      readOnly: true
    })
  ]
});
