import { defineType, defineField, defineArrayMember } from "sanity";

const accordionBlock = defineType({
  name: "accordionBlock",
  title: "Accordion Block",
  type: "object", // Change to object
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
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string"
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "contentBlock"
            })
          ]
        })
      ]
    })
  ]
});

export default accordionBlock;
