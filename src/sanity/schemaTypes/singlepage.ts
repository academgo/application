import { defineField } from "sanity";

const singlepage = {
  name: "singlepage",
  title: "Single Page",
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
      title: "Title",
      type: "string"
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "localizedSlug"
    }),
    defineField({
      name: "coverBlock",
      title: "Cover Block",
      type: "object",
      fields: [
        defineField({
          name: "coverImage",
          title: "Cover Image",
          type: "image",
          options: {
            hotspot: true
          }
        }),
        defineField({
          name: "coverImageAlt",
          title: "Cover Image Alt",
          type: "string"
        }),
        defineField({
          name: "coverTitle",
          title: "H1 | Cover Title",
          type: "string"
        }),
        defineField({
          name: "coverText",
          title: "Cover Text",
          type: "string"
        })
      ]
    }),
    // defineField({
    //   name: "previewImage",
    //   title: "Preview Image",
    //   type: "image",
    //   options: {
    //     hotspot: true
    //   },
    //   description: "Основное изображение страницы"
    // }),
    defineField({
      name: "contentBlocks",
      title: "Main Content",
      type: "array",
      description:
        "Блоки контента, которые будут отображаться в статье. Это основное содержание статьи",
      of: [
        { type: "textContent" },
        { type: "doubleTextBlock" },
        { type: "whiteBlock" },
        { type: "accordionBlock" },
        { type: "doubleImagesBlock" },
        { type: "tabsBlock" },
        { type: "bulletsBlock" },
        { type: "benefitsBlock" },
        { type: "linksBlock" },
        { type: "sliderBlock" },
        { type: "sliderPicturesBlock" },
        { type: "cascadeBlock" },
        { type: "packagePriceBlock" },
        { type: "extraBlock" },
        { type: "compareBlock" },
        { type: "processBlock" },
        { type: "pricingTable" },
        { type: "logosBlock" },
        { type: "offerBlock" },
        { type: "contactsBlock" },
        { type: "surveyBlock" },
        { type: "packagesBlock" },
        { type: "tableBlock" }
      ]
    }),
    defineField({
      name: "publishedAt",
      title: "Date of publication",
      type: "datetime"
    }),
    defineField({
      name: "language",
      type: "string",
      initialValue: "id",
      readOnly: true
    })
  ]
};

export default singlepage;
