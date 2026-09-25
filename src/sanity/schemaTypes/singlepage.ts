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
      name: "shortTitle",
      title: "Short title",
      type: "string",
      description:
        "Короткое название для хлебных крошек и меню: «Istanbul Medipol University» вместо полного заголовка страницы"
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
      name: "country",
      title: "Country",
      type: "reference",
      to: [{ type: "country" }],
      description: "Страна обучения: нужна для меню, хлебных крошек и перелинковки"
    }),
    defineField({
      name: "pageType",
      title: "Page type",
      type: "string",
      options: {
        list: [
          { title: "Хаб страны", value: "country-hub" },
          { title: "Тематическая страница", value: "topic" },
          { title: "Карточка вуза", value: "university-card" },
          { title: "Другое", value: "other" }
        ]
      }
    }),
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
        { type: "videosBlock" },
        { type: "tableBlock" },
        { type: "countriesCompareBlock" },
        { type: "countriesLinksBlock" },
        { type: "countryUniversitiesBlock" },
        { type: "leadMagnetBlock" },
        { type: "consultationFormBlock" }
      ]
    }),
    defineField({
      name: "videoPlan",
      title: "Video plan",
      type: "array",
      description:
        "План съёмок для этой страницы: какие ролики нужны и о чём. Не отображается на сайте — после съёмки видео добавляется блоком Videos Block.",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "slot", title: "Video title", type: "string" }),
            defineField({
              name: "duration",
              title: "Duration",
              type: "string"
            }),
            defineField({
              name: "brief",
              title: "What to shoot",
              type: "text",
              rows: 4
            })
          ],
          preview: { select: { title: "slot", subtitle: "duration" } }
        }
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
