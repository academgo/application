import { defineType, defineField, defineArrayMember } from "sanity";

const surveyBlock = defineType({
  name: "surveyBlock",
  title: "Survey Block",
  type: "object", // Change to object
  fields: [
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
        // defineField({
        //   name: "image",
        //   title: "Image",
        //   type: "image"
        // }),
        // defineField({
        //   name: "quote",
        //   title: "Quote",
        //   type: "string"
        // }),
        // defineField({
        //   name: "description",
        //   title: "Description",
        //   type: "string"
        // }),
        // defineField({
        //   name: "finalTitle",
        //   title: "Final Title",
        //   type: "string"
        // }),
        // defineField({
        //   name: "formTitle",
        //   title: "Form Title",
        //   type: "string"
        // }),
        // defineField({
        //   name: "inputLabel",
        //   title: "Input Label",
        //   type: "string"
        // }),
        // defineField({
        //   name: "buttonText",
        //   title: "Button Text",
        //   type: "string"
        // }),
        defineField({
          name: "quizBlock",
          title: "Quiz Block",
          type: "quizBlock"
        })
      ]
    })
    // survey block
  ]
});

export default surveyBlock;
