import { defineField } from "sanity";

const subpage = {
  name: "subpage",
  title: "Subpage",
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
      name: "parentPage",
      title: "Parent Page",
      type: "reference",
      to: [{ type: "singlepage" }],
      description: "Select the parent page for this subpage"
    }),
    defineField({
      name: "contentBlocks",
      title: "Main Content",
      type: "array",
      of: [
        { type: "textContent" },
        { type: "accordionBlock" },
        { type: "doubleImagesBlock" },
        { type: "tabsBlock" }
      ]
    }),
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
      name: "language",
      type: "string",
      initialValue: "id",
      readOnly: true
    })
  ]
};

export default subpage;
