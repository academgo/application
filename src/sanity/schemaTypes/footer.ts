import { defineField } from "sanity";

const footer = {
  name: "footer",
  title: "Footer",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string"
    }),
    // cousultation block
    defineField({
      name: "ctaDocument",
      title: "Messenger card above the footer",
      type: "reference",
      to: [{ type: "ctaDocument" }],
      description:
        "When set, the block with the form above the footer is replaced by a card with Telegram and WhatsApp buttons."
    }),
    defineField({
      name: "popupCtaDocument",
      title: "Messenger card in the popup",
      type: "reference",
      to: [{ type: "ctaDocument" }],
      description:
        "The popup opened by the buttons across the site. Empty — the card above the footer is used."
    }),
    defineField({
      name: "headerCtaDocument",
      title: "Messenger card in the header button popup",
      type: "reference",
      to: [{ type: "ctaDocument" }],
      description:
        "The header button promises a bot, so its popup has its own text. Empty — «Messenger card in the popup» is used"
    }),
    defineField({
      name: "consultationBlock",
      title: "Consultation Block",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string"
        }),
        defineField({
          name: "titleHighlight",
          title: "Title Highlight",
          type: "string"
        }),
        defineField({
          name: "listTitle",
          title: "List Title",
          type: "string"
        }),
        defineField({
          name: "list",
          title: "List",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "List Item",
                  type: "string"
                })
              ]
            }
          ]
        }),
        defineField({
          name: "giftText",
          title: "Gift Text",
          type: "string"
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "string"
        }),
        defineField({
          name: "formTitle",
          title: "Form Title",
          type: "string"
        }),
        defineField({
          name: "form",
          title: "Form",
          type: "reference", // Используйте ссылку на форму
          to: [{ type: "formStandardDocument" }]
        }),
        defineField({
          name: "buttonCustomText",
          title: "Button Custom Text",
          type: "string"
        }),
        defineField({
          name: "altText",
          title: "Alternate Text",
          type: "string"
        }),
        defineField({
          name: "contactLinks",
          title: "Contact links",
          type: "array",
          description: "Links to messengers",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "Title",
                  type: "string"
                }),
                defineField({
                  name: "icon",
                  title: "Icon",
                  type: "image"
                }),
                defineField({
                  name: "link",
                  title: "Link",
                  type: "string"
                })
              ]
            }
          ]
        })
      ]
    }),
    // cousultation block
    defineField({
      name: "logo",
      title: "Logo",
      type: "image"
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "string"
    }),
    defineField({
      name: "workingHours",
      title: "Working hours",
      type: "string"
    }),
    defineField({
      name: "phoneNumber",
      title: "Phone number",
      type: "string",
      description: "Only numbers with spaces and special characters"
    }),
    defineField({
      name: "footerEmail",
      title: "Email",
      type: "string"
    }),
    defineField({
      name: "adress",
      title: "Adress",
      type: "string"
    }),
    defineField({
      name: "navLinks",
      title: "Navigation links",
      type: "array",
      of: [
        {
          type: "object",
          name: "footerCountryLink",
          title: "Пункт колонки",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string"
            }),
            defineField({
              name: "link",
              title: "Link",
              type: "string"
            })
          ]
        }
      ]
    }),
    defineField({
      name: "countriesTitle",
      title: "Countries column title",
      type: "string",
      description: "Заголовок колонки со странами"
    }),
    defineField({
      name: "countryLinks",
      title: "Колонка «Страны»: список и порядок",
      type: "array",
      description:
        "Порядок задаётся перетаскиванием. Пункт — либо страна (название и ссылка возьмутся с её страницы), либо произвольная ссылка, например «Сравнить страны». Если список пуст, выводятся все страны в порядке мега-меню, как было раньше",
      of: [
        {
          type: "object",
          name: "footerCountryLink",
          title: "Пункт колонки",
          fields: [
            defineField({
              name: "country",
              title: "Страна",
              type: "reference",
              to: [{ type: "country" }],
              description:
                "Для обычного пункта. Название и адрес берутся со страницы страны"
            }),
            defineField({
              name: "label",
              title: "Своя подпись",
              type: "string",
              description:
                "Необязательно для страны — заменит её название. Для произвольной ссылки обязательно"
            }),
            defineField({
              name: "link",
              title: "Своя ссылка",
              type: "string",
              description:
                "Заполняйте, только если это не страна: например /ru/ucheba-za-rubezhom"
            })
          ],
          preview: {
            select: {
              label: "label",
              countryTitle: "country.title",
              link: "link"
            },
            prepare({ label, countryTitle, link }) {
              return {
                title: label || countryTitle || link || "Пункт не заполнен",
                subtitle: countryTitle ? "страна" : link || "не заполнено"
              };
            }
          }
        }
      ]
    }),
    defineField({
      name: "navTitle",
      title: "Navigation column title",
      type: "string"
    }),
    defineField({
      name: "contactsTitle",
      title: "Contacts column title",
      type: "string"
    }),
    defineField({
      name: "partnersLabel",
      title: "Contacts column label",
      type: "string",
      description:
        "Подпись над email, например «Для партнёров, B2B и предложений:»"
    }),
    defineField({
      name: "contactNote",
      title: "Contacts note",
      type: "text",
      rows: 2,
      description:
        "Короткая заметка под адресом, например про приём заявок в Telegram"
    }),
    defineField({
      name: "contactLinksTitle",
      title: "Contact links title",
      type: "string"
    }),
    defineField({
      name: "contactLinks",
      title: "Contact links",
      type: "array",
      description: "Links to messengers",
      of: [
        {
          type: "object",
          name: "footerCountryLink",
          title: "Пункт колонки",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string"
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "image"
            }),
            defineField({
              name: "link",
              title: "Link",
              type: "string"
            })
          ]
        }
      ]
    }),
    defineField({
      name: "buttonText",
      title: "Button text",
      type: "string"
    }),
    defineField({
      name: "copyright",
      title: "Copyright",
      type: "string"
    }),
    defineField({
      name: "privacyLink",
      title: "Privacy link",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          type: "string"
        }),
        defineField({
          name: "link",
          title: "Link",
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

export default footer;
