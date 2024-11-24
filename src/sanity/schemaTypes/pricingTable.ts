import { defineType, defineField } from "sanity";

const pricingTable = defineType({
  name: "pricingTable",
  title: "Pricing Table",
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
      type: "text"
    }),
    defineField({
      name: "plans",
      title: "Plans",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "planPretitle",
              title: "Plan Pretitle",
              type: "string"
            }),
            defineField({
              name: "planName",
              title: "Plan Name",
              type: "string"
            }),
            defineField({
              name: "planPrice",
              title: "Plan Price",
              type: "string"
            }),
            defineField({
              name: "promoText",
              title: "Promo Text",
              type: "string",
              description: "Optional promotional text, e.g., 'Most popular!'"
            }),
            defineField({
              name: "planLink",
              title: "Plan Link",
              type: "object",
              fields: [
                defineField({
                  name: "label",
                  title: "Label",
                  type: "string"
                }),
                defineField({
                  name: "destination",
                  title: "Destination",
                  type: "url"
                })
              ]
            }),
            defineField({
              name: "features",
              title: "Features",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "featureName",
                      title: "Feature Name",
                      type: "string"
                    }),
                    defineField({
                      name: "availability",
                      title: "Availability",
                      type: "string",
                      options: {
                        list: [
                          { title: "Available", value: "available" },
                          { title: "Unavailable", value: "unavailable" }
                        ]
                      }
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
              name: "isHighlighted",
              title: "Highlighted Plan",
              type: "boolean",
              description:
                "Highlight this plan (changes colors to #1f2937 background and white text)."
            })
          ]
        }
      ]
    })
  ]
});

export default pricingTable;
