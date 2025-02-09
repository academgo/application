import { defineField } from "sanity";

const blog = {
  name: "blog",
  title: "Blog",
  type: "document",
  fields: [
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
      name: "title",
      title: "H1 | Title of the article",
      type: "string"
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "localizedSlug"
    }),
    defineField({
      name: "publishedAt",
      title: "Date of publication",
      type: "datetime"
    }),
    // defineField({
    //   name: "category",
    //   title: "Category",
    //   type: "reference",
    //   to: [{ type: "category" }]
    // }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      options: {
        filter: ({ document }) => {
          return {
            filter: "language == $language",
            params: { language: document.language }
          };
        }
      }
    }),
    defineField({
      name: "firstContent",
      title: "First Content of the article",
      type: "textContent"
    }),
    defineField({
      name: "previewImage",
      title: "Preview Image",
      type: "image",
      options: {
        hotspot: true
      },
      description: "Основное изображение статьи"
    }),
    defineField({
      name: "contentBlocks",
      title: "Main Content",
      type: "array",
      description:
        "Блоки контента, которые будут отображаться в статье. Это основное содержание статьи",
      of: [
        { type: "textContent" },
        { type: "accordionBlock" },
        { type: "doubleImagesBlock" },
        { type: "tabsBlock" }
      ]
    }),
    defineField({
      name: "videoBlock",
      title: "Video Block",
      type: "object",
      fields: [
        defineField({
          name: "videoId",
          title: "Video ID",
          type: "string"
        }),
        defineField({
          name: "posterImage",
          title: "Video Image",
          type: "image"
        })
      ]
    }),
    defineField({
      name: "relatedArticles",
      title: "Related Articles",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "blog" }, { type: "singlepage" }, { type: "subpage" }],
          options: {
            filter: ({ document }) => {
              return {
                filter: "language == $language",
                params: { language: document.language }
              };
            }
          }
        }
      ]
    }),
    defineField({
      name: "language",
      type: "string",
      initialValue: "id",
      readOnly: true
    })
  ]
};

export default blog;
