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
    defineField({
      name: "conditionsTitle",
      title: "Conditions Title",
      type: "string"
    }),
    defineField({
      name: "conditionFirst",
      title: "Condition 1",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string"
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "string"
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image"
        })
      ]
    }),
    defineField({
      name: "conditionSecond",
      title: "Condition 2",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string"
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "string"
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image"
        })
      ]
    }),
    defineField({
      name: "conditionThird",
      title: "Condition 3",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string"
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "string"
        })
      ]
    }),
    defineField({
      name: "conditionFourth",
      title: "Condition 4",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string"
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "string"
        }),
        defineField({
          name: "linkLabel",
          title: "Link Label",
          type: "string"
        }),
        defineField({
          name: "linkDestination",
          title: "Link Destination",
          type: "string"
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image"
        })
      ]
    }),
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
        {
          type: "object",
          fields: [
            defineField({
              name: "videoId",
              title: "Video ID",
              type: "string"
            }),
            defineField({
              name: "posterImage",
              title: "Poster Image",
              type: "image"
            }),
            defineField({
              name: "date",
              title: "Date",
              type: "string"
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string"
            })
          ]
        }
      ]
    }),
    defineField({
      name: "offerTitle",
      title: "Offer Title",
      type: "string"
    }),
    defineField({
      name: "offerTitleHighlight",
      title: "Offer Title Highlight",
      type: "string"
    }),
    defineField({
      name: "offerListTitle",
      title: "Offer List Title",
      type: "string"
    }),
    defineField({
      name: "offerList",
      title: "Offer List",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "offerListItem",
              title: "Offer List Item",
              type: "string"
            })
          ]
        }
      ]
    }),
    defineField({
      name: "giftText",
      title: "Gift Text",
      type: "string"
    }),
    defineField({
      name: "offerDesctiption",
      title: "Offer Description",
      type: "string"
    }),
    defineField({
      name: "offerFormTitle",
      title: "Offer Form Title",
      type: "string"
    }),
    defineField({
      name: "offerForm",
      title: "Offer Form",
      type: "reference", // Используйте ссылку на форму
      to: [{ type: "formStandardDocument" }]
    }),
    defineField({
      name: "offerButtonCustomText",
      title: "Offer Button Custom Text",
      type: "string"
    }),
    defineField({
      name: "offerAltText",
      title: "Offer Alternate Text",
      type: "string"
    }),
    defineField({
      name: "offerContactLinks",
      title: "Offer Contact links",
      type: "array",
      description: "Links to messengers",
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
              name: "icon",
              title: "Icon",
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
