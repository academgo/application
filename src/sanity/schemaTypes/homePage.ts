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
      name: "seo",
      title: "SEO",
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
      name: "mainHeadingH1",
      title: "Main Heading H1",
      type: "string"
    }),
    defineField({
      name: "mainHeadingH1Highlight",
      title: "Main Heading H1 Highlight",
      type: "string"
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
      name: "universitiesBlock",
      title: "Universities Block",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string"
        }),
        defineField({
          name: "universities",
          title: "Universities",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "University Name",
                  type: "string"
                }),
                defineField({
                  name: "logo",
                  title: "Logo",
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
          name: "programHighlight",
          title: "Program Highlight",
          type: "string"
        }),
        defineField({
          name: "programTitle",
          title: "Program Title",
          type: "string"
        }),
        defineField({
          name: "programs",
          title: "Programs",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "textStart",
                  title: "Text Start",
                  type: "string"
                }),
                defineField({
                  name: "textEnd",
                  title: "Text End",
                  type: "string"
                }),
                defineField({
                  name: "boldStartOrEnd",
                  title: "Bold start or end",
                  type: "boolean"
                })
              ]
            }
          ]
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
    defineField({
      name: "facultiesTitle",
      title: "Faculties Title",
      type: "string"
    }),
    defineField({
      name: "faculties",
      title: "Faculties",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "facultyName",
              title: "Faculty Name",
              type: "string"
            }),
            defineField({
              name: "facultyDescription",
              title: "Faculty Description",
              type: "string"
            }),
            defineField({
              name: "specialtiesTitle",
              title: "Specialties Title",
              type: "string"
            }),
            defineField({
              name: "specialties",
              title: "Specialties",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "title",
                      title: "Speciality Name",
                      type: "string"
                    })
                  ]
                }
              ]
            }),
            defineField({
              name: "semesters",
              title: "Semesters",
              type: "string"
            }),
            defineField({
              name: "cost",
              title: "Cost",
              type: "string"
            }),
            defineField({
              name: "universitiesTitle",
              title: "Universities Title",
              type: "string"
            }),
            defineField({
              name: "universities",
              title: "Universities",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "title",
                      title: "University Name",
                      type: "string"
                    })
                  ]
                }
              ]
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
              name: "hasBorder",
              title: "Has Border",
              type: "boolean"
            })
          ]
        }
      ]
    }),
    defineField({
      name: "lastSlideTitleHighlight",
      title: "Last Slide Title Highlight",
      type: "string"
    }),
    defineField({
      name: "lastSlideTitle",
      title: "Last Slide Title",
      type: "string"
    }),
    defineField({
      name: "lastSlideDescription",
      title: "Last Slide Description",
      type: "string"
    }),
    defineField({
      name: "lastSlideForm",
      title: "Last Slide Form",
      type: "reference", // Используйте ссылку на форму
      to: [{ type: "formStandardDocument" }]
    }),
    // survey block
    defineField({
      name: "survey",
      title: "Survey",
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
          name: "quote",
          title: "Quote",
          type: "string"
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "string"
        }),
        defineField({
          name: "finalTitle",
          title: "Final Title",
          type: "string"
        }),
        defineField({
          name: "formTitle",
          title: "Form Title",
          type: "string"
        }),
        defineField({
          name: "inputLabel",
          title: "Input Label",
          type: "string"
        }),
        defineField({
          name: "buttonText",
          title: "Button Text",
          type: "string"
        })
      ]
    }),
    // survey block
    // about block
    defineField({
      name: "aboutSummary",
      title: "About Summary",
      type: "string"
    }),
    defineField({
      name: "aboutTitle",
      title: "About Title",
      type: "string"
    }),
    defineField({
      name: "aboutParagraphs",
      title: "About Paragraphs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Paragraph",
              type: "string"
            })
          ]
        }
      ]
    }),
    defineField({
      name: "aboutSocialsTitle",
      title: "About Socials Title",
      type: "string"
    }),
    defineField({
      name: "aboutSocials",
      title: "About Socials",
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
    defineField({
      name: "aboutOffersTitle",
      title: "About Offers Title",
      type: "string"
    }),
    defineField({
      name: "aboutOffers",
      title: "About Offers",
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
    defineField({
      name: "ceos",
      title: "CEOs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string"
            }),
            defineField({
              name: "position",
              title: "Position",
              type: "string"
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image"
            })
          ]
        }
      ]
    }),
    // about block
    // principles block
    defineField({
      name: "principlesTitle",
      title: "Principles Title",
      type: "string"
    }),
    defineField({
      name: "principles",
      title: "Principles",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "textStart",
              title: "Text Start",
              type: "string"
            }),
            defineField({
              name: "textEnd",
              title: "Text End",
              type: "string"
            }),
            defineField({
              name: "boldStartOrEnd",
              title: "Bold start or end",
              type: "boolean"
            })
          ]
        }
      ]
    }),
    defineField({
      name: "principlesTotal",
      title: "Principles Total",
      type: "object",
      fields: [
        defineField({
          name: "number",
          title: "Number",
          type: "string"
        }),
        defineField({
          name: "descriptionBold",
          title: "Description Bold",
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
      name: "principlesFinal",
      title: "Principles Final",
      type: "string"
    }),
    // principles block
    // steps block
    defineField({
      name: "stepOne",
      title: "Step One",
      type: "object",
      fields: [
        defineField({
          name: "number",
          title: "Number",
          type: "string"
        }),
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
          name: "resultText",
          title: "Result Text",
          type: "string"
        }),
        defineField({
          name: "items",
          title: "Items",
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
                  name: "description",
                  title: "Description",
                  type: "string"
                })
              ]
            }
          ]
        }),
        defineField({
          name: "buttonText",
          title: "Button Text",
          type: "string"
        }),
        defineField({
          name: "video",
          title: "Video",
          type: "videoShort"
        })
      ]
    }),

    defineField({
      name: "stepTwo",
      title: "Step Two",
      type: "object",
      fields: [
        defineField({
          name: "number",
          title: "Number",
          type: "string"
        }),
        defineField({
          name: "title",
          title: "Title",
          type: "string"
        }),
        defineField({
          name: "littleText",
          title: "Little Text",
          type: "string"
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
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
          name: "video",
          title: "Video",
          type: "videoShort"
        })
      ]
    }),

    defineField({
      name: "stepThree",
      title: "Step Three",
      type: "object",
      fields: [
        defineField({
          name: "number",
          title: "Number",
          type: "string"
        }),
        defineField({
          name: "title",
          title: "Title",
          type: "string"
        }),
        defineField({
          name: "substeps",
          title: "Substeps",
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
                  name: "description",
                  title: "Description",
                  type: "string"
                }),
                defineField({
                  name: "highlight",
                  title: "Highlight",
                  type: "string"
                })
              ]
            }
          ]
        }),
        defineField({
          name: "video",
          title: "Video",
          type: "videoShort"
        })
      ]
    }),

    defineField({
      name: "stepFour",
      title: "Step Four",
      type: "object",
      fields: [
        defineField({
          name: "number",
          title: "Number",
          type: "string"
        }),
        defineField({
          name: "title",
          title: "Title",
          type: "string"
        }),
        defineField({
          name: "littleText",
          title: "Little Text",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
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
          name: "list",
          title: "List",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
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
          name: "image",
          title: "Image",
          type: "image"
        })
      ]
    }),
    // steps block
    // extra block
    defineField({
      name: "extraBlock",
      title: "Extra Block",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string"
        }),
        defineField({
          name: "items",
          title: "Items",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
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
          name: "asideContent",
          title: "Aside Content",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
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
          name: "bgImage",
          title: "Background Image",
          type: "image"
        })
      ]
    }),
    // extra block
    // price block
    defineField({
      name: "priceTitle",
      title: "Price Title",
      type: "string"
    }),
    defineField({
      name: "priceBlock",
      title: "Price Block",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "preTitle",
              title: "Pretitle",
              type: "string"
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string"
            }),
            defineField({
              name: "itemsTitle",
              title: "Items Title",
              type: "string"
            }),
            defineField({
              name: "items",
              title: "Items",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
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
              name: "cost",
              title: "Cost",
              type: "string"
            }),
            defineField({
              name: "stageCost",
              title: "Stage Cost",
              type: "string"
            }),
            defineField({
              name: "buttonText",
              title: "Button Text",
              type: "string"
            }),
            defineField({
              name: "buttonLink",
              title: "Button Link",
              type: "string"
            }),
            defineField({
              name: "hasBorder",
              title: "Has Border",
              type: "boolean"
            }),
            defineField({
              name: "hasBg",
              title: "Has Background",
              type: "boolean"
            })
          ]
        }
      ]
    }),
    // price block
    // accordion block
    defineField({
      name: "faq",
      title: "FAQ",
      type: "accordionBlock"
    }),
    // accordion block
    // optional
    defineField({
      name: "language",
      type: "string",
      initialValue: "id",
      readOnly: true
    })
  ]
});
