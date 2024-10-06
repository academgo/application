import React from "react";
import { AccordionItem as Item } from "@szhsin/react-accordion";
import styles from "./AccordionItem.module.scss";
import { PortableText } from "@portabletext/react";
import { RichText } from "../RichText/RichText";

type AccordionItemProps = {
  title: string;
  content: any;
  expanded: boolean;
  onClick: () => void;
};

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  content,
  expanded,
  onClick
}) => {
  if (!title || !content) {
    return null;
  }

  // Создаем JSON-LD разметку для FAQ
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: title, // Вопрос из заголовка аккордеона
        acceptedAnswer: {
          "@type": "Answer",
          text: content // Ответ из содержимого аккордеона
        }
      }
    ]
  };

  return (
    <>
      {/* Микроразметка FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Item
        header={
          <div className={styles.headerFlex}>
            {title}
            <span className={styles.toggleIcon}>
              {expanded ? (
                <svg
                  className={`${styles.accordionIcon} ${styles.rotate}`}
                  width="50"
                  height="50"
                  viewBox="0 0 50 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.0566406"
                    y="50"
                    width="50"
                    height="49.9439"
                    rx="24.9719"
                    transform="rotate(-90 0.0566406 50)"
                    fill="#091728"
                  />
                  <path
                    d="M17.8036 19.2411L31.0847 32.5222L32.5283 31.0786L19.2472 17.7975L17.8036 19.2411Z"
                    fill="white"
                  />
                  <path
                    d="M24.633 17.4778L24.633 19.5194L19.5699 19.5194L19.5699 24.5825L17.5283 24.5825L17.5283 17.4778L24.633 17.4778Z"
                    fill="white"
                  />
                </svg>
              ) : (
                <svg
                  className={styles.accordionIcon}
                  width="50"
                  height="50"
                  viewBox="0 0 50 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.0566406"
                    y="50"
                    width="50"
                    height="49.9439"
                    rx="24.9719"
                    transform="rotate(-90 0.0566406 50)"
                    fill="#091728"
                  />
                  <path
                    d="M17.8036 19.2411L31.0847 32.5222L32.5283 31.0786L19.2472 17.7975L17.8036 19.2411Z"
                    fill="white"
                  />
                  <path
                    d="M24.633 17.4778L24.633 19.5194L19.5699 19.5194L19.5699 24.5825L17.5283 24.5825L17.5283 17.4778L24.633 17.4778Z"
                    fill="white"
                  />
                </svg>
              )}
            </span>
          </div>
        }
        className={styles.item}
        buttonProps={{
          className: `${styles.itemBtn} ${
            expanded ? styles.itemBtnExpanded : styles.itemBtnCollapsed
          }`,
          onClick: onClick,
          style: { borderRadius: expanded ? "30px 30px 0 0" : "30px" }
        }}
        contentProps={{ className: styles.itemContent }}
        panelProps={{ className: styles.itemPanel }}
      >
        <PortableText value={content} components={RichText} />
      </Item>
    </>
  );
};

export default AccordionItem;
