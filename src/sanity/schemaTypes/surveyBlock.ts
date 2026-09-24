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
          name: "quizDocument",
          title: "Quiz",
          type: "reference",
          to: [{ type: "quizDocument" }],
          description:
            "Общий квиз: вопросы редактируются один раз в разделе Quiz. Если поле заполнено, вопросы ниже не используются."
        }),
        defineField({
          name: "quizBlock",
          title: "Quiz Block (свои вопросы для этой страницы)",
          type: "quizBlock"
        })
      ]
    })
    // survey block
  ]
});

export default surveyBlock;
