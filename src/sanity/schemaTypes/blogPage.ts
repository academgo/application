import { defineField, defineType } from "sanity";

const blogPage = defineType({
  name: "blogPage",
  title: "Blog Main Page",
  type: "document",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description:
        "Заголовок страницы в поисковой выдаче. Максимум 70 символов."
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "string",
      description:
        "Описание страницы в поисковой выдаче. Максимум 160 символов."
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "accordionBlock"
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "localizedSlug"
    }),
    defineField({
      name: "language",
      type: "string",
      initialValue: "id",
      readOnly: true
    })
  ]
});

export default blogPage;
