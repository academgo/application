import { defineType, defineField, defineArrayMember } from "sanity";

const tabsBlock = defineType({
  name: "tabsBlock",
  title: "Tabs Block",
  type: "object", // Change to object
  fields: [
    defineField({
      name: "tabs",
      title: "Tabs",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "tabTitle",
              title: "Tab Title",
              type: "string"
            }),
            defineField({
              name: "tabImage",
              title: "Tab Image",
              type: "image"
            }),
            defineField({
              name: "tabContent",
              title: "Tab Content",
              type: "contentBlock"
            })
          ]
        })
      ]
    })
  ]
});

export default tabsBlock;
