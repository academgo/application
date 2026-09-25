import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "countryMapBlock",
  title: "Country map",
  type: "object",
  description: "Контур страны с городами, где находятся вузы.",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      options: {
        list: [
          { title: "Грузия", value: "georgia" },
          { title: "Венгрия", value: "hungary" },
          { title: "Италия", value: "italy" },
          { title: "Испания", value: "spain" },
          { title: "Малайзия", value: "malaysia" },
          { title: "Турция", value: "turkey" },
          { title: "ОАЭ", value: "uae" },
          { title: "Северный Кипр", value: "north-cyprus" },
          { title: "Кипр (юг)", value: "south-cyprus" }
        ]
      }
    }),
    defineField({
      name: "points",
      title: "Cities",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "city", title: "City", type: "string" }),
            defineField({ name: "lat", title: "Latitude", type: "number" }),
            defineField({ name: "lon", title: "Longitude", type: "number" }),
            defineField({
              name: "universities",
              title: "Universities",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({
                      name: "name",
                      title: "Name",
                      type: "string"
                    }),
                    defineField({
                      name: "href",
                      title: "Link",
                      type: "string",
                      description: "Страница вуза на сайте, если есть"
                    })
                  ],
                  preview: { select: { title: "name", subtitle: "href" } }
                })
              ]
            })
          ],
          preview: { select: { title: "city" } }
        })
      ]
    }),
    defineField({ name: "note", title: "Note", type: "string" })
  ],
  preview: {
    select: { title: "title", country: "country" },
    prepare: ({ title, country }: { title?: string; country?: string }) => ({
      title: title || "Карта",
      subtitle: `Country map · ${country || ""}`
    })
  }
});
