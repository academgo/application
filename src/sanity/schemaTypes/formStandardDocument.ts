import { defineType, defineField } from "sanity";
import formStandard from "./formStandard";

const formStandardDocument = defineType({
  name: "formStandardDocument",
  title: "Form Standard",
  type: "document",
  fields: [
    defineField({
      name: "form",
      title: "Form",
      type: "formStandard"
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

export default formStandardDocument;
