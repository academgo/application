import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "timelineBlock",
  title: "Timeline",
  type: "object",
  description:
    "Шкала по времени: когда подавать документы, получать визу, ехать. 3–6 этапов.",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
    defineField({
      name: "items",
      title: "Stages",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "period",
              title: "Period",
              type: "string",
              description: "«Октябрь–январь», «За 3 месяца до учёбы»"
            }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "text", title: "Text", type: "text", rows: 3 })
          ],
          preview: { select: { title: "title", subtitle: "period" } }
        })
      ]
    }),
    defineField({ name: "note", title: "Note", type: "string" })
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }: { title?: string }) => ({
      title: title || "Шкала",
      subtitle: "Timeline"
    })
  }
});
