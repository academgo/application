import { defineType, defineField } from "sanity";

const sliderBlock = defineType({
  name: "sliderBlock",
  title: "Slider Block",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string"
    }),
    defineField({
      name: "slides",
      title: "Slides",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image"
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
              name: "subTitle",
              title: "Sub Title",
              type: "string"
            }),
            defineField({
              name: "sliderList",
              title: "Slider List",
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
      name: "slidesPerView",
      title: "Slides Per View",
      type: "string"
    })
  ]
});

export default sliderBlock;
