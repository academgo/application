import { defineType, defineField } from "sanity";

const category = defineType({
  name: "category",
  title: "Category",
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
    // optional
    defineField({
      name: "language",
      type: "string",
      initialValue: "id",
      readOnly: true
    })
    // defineField({
    //   name: "seo",
    //   title: "SEO",
    //   type: "object",
    //   fields: [
    //     defineField({
    //       name: "metaTitle",
    //       title: "Meta Title",
    //       type: "string"
    //     }),
    //     defineField({
    //       name: "metaDescription",
    //       title: "Meta Description",
    //       type: "string"
    //     })
    //   ]
    // }),
    // defineField({
    //   name: "parentCategory",
    //   title: "Parent Category",
    //   type: "reference",
    //   to: [{ type: "category" }]
    // }),
    // defineField({
    //   name: "description",
    //   title: "Description",
    //   type: "blockContent"
    // }),
    // defineField({
    //   name: "previewImage",
    //   title: "Preview Image",
    //   type: "image",
    //   options: {
    //     hotspot: true
    //   },
    //   description: "Основное изображение категории"
    // })
  ]
});

export default category;
