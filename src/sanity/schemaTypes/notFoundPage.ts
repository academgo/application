import { defineField } from "sanity";

const notFoundPage = {
  name: "notFoundPage",
  title: "404 Page",
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
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta Title",
          type: "string"
        }),
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "string"
        })
      ]
    }),
    defineField({
      name: "textStart",
      title: "Text Start",
      type: "string"
    }),
    defineField({
      name: "textend",
      title: "Text End",
      type: "string"
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string"
    }),
    defineField({
      name: "buttonText",
      title: "Button Text",
      type: "string"
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image"
    }),
    defineField({
      name: "language",
      type: "string",
      initialValue: "id",
      readOnly: true
    })
  ]
};

export default notFoundPage;
