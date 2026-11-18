// schemaTypes/workStepsBlock.ts
import { defineField, defineArrayMember } from "sanity";

/** Иконки берутся из набора в коде — загружать картинки не нужно */
export const WORK_STEP_ICONS = [
  { title: "Consultation (chat bubble)", value: "chat" },
  { title: "Document", value: "document" },
  { title: "Admission (diploma)", value: "diploma" },
  { title: "Passport", value: "passport" },
  { title: "Check mark", value: "check" },
  { title: "Plane", value: "plane" },
  { title: "House", value: "home" }
];

/**
 * На главной блок лежит полем документа, в странице — элементом массива.
 * Вставленный в страницу блок показывает шаги с главной, поэтому поля
 * там скрыты: пустые строки выглядели как недоделанный блок.
 */
const insertedInPage = ({ parent, value }: any) =>
  Boolean(parent?._key) &&
  (value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0));

const workStepsBlock = {
  name: "workStepsBlock",
  title: "Work steps",
  type: "object",
  description:
    "Short «how we work» guide. A marquee with the step number and title runs between the steps. Inserted into a page, the block shows the steps from the homepage.",
  fields: [
    defineField({
      name: "heading",
      title: "Block heading",
      type: "text",
      rows: 2,
      description: "Rendered as a second level heading",
      hidden: insertedInPage
    }),

    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      hidden: insertedInPage,
      of: [
        defineArrayMember({
          type: "object",
          name: "workStep",
          fields: [
            defineField({
              name: "number",
              title: "Number",
              type: "string",
              description: "Goes into the marquee: «шаг 1»"
            }),
            defineField({
              name: "title",
              title: "Step title",
              type: "string",
              description: "Goes into the marquee as well"
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              initialValue: "document",
              options: { list: WORK_STEP_ICONS }
            }),
            defineField({
              name: "text",
              title: "Description",
              type: "text",
              rows: 3,
              description: "One or two sentences, no more"
            }),
            defineField({
              name: "bullets",
              title: "Bullet points",
              type: "array",
              of: [{ type: "string" }],
              description: "Short lines, three or four per step"
            }),
            defineField({
              name: "footnote",
              title: "Footnote in the bottom bar",
              type: "string",
              description:
                "Short line left of the button: how long the step takes, a condition, anything to the point"
            }),
            defineField({
              name: "buttonText",
              title: "Button label",
              type: "string",
              description: "Empty — the step has no button"
            }),
            defineField({
              name: "buttonLink",
              title: "Button link",
              type: "url",
              description:
                "Empty while the label is set — the button goes to Telegram by default",
              validation: Rule => Rule.uri({ scheme: ["http", "https"] })
            })
          ],
          preview: {
            select: { title: "title", subtitle: "number" }
          }
        })
      ],
      validation: Rule =>
        Rule.max(6).warning("More than six steps is no longer a guide")
    })
  ],
  preview: {
    select: { heading: "heading", key: "_key" },
    prepare: (selection: Record<string, unknown>) => ({
      title: "Work steps",
      subtitle: selection.key
        ? "Steps — same as on the homepage"
        : (selection.heading as string) || "No heading"
    })
  }
};

export default workStepsBlock;
