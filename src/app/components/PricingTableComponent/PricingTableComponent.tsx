import React, { FC } from "react";
import { PricingTable } from "@/types/blog";
import styles from "./PricingTableComponent.module.scss";
import { ButtonModal } from "../ButtonModal/ButtonModal";

type Props = {
  block: PricingTable;
};

// Helper function to style the last two words
const formatTitleWithHighlightedWords = (title: string) => {
  const words = title.split(" ");
  if (words.length <= 2) {
    return <span className={styles.highlightedText}>{title}</span>;
  }
  const normalText = words.slice(0, -2).join(" ");
  const highlightedText = words.slice(-2).join(" ");
  return (
    <>
      {normalText}{" "}
      <span className={styles.highlightedText}>{highlightedText}</span>
    </>
  );
};

const PricingTableComponent: FC<Props> = ({ block }) => {
  return (
    <section className={styles.pricingTable}>
      <div className={styles.container}>
        <p className={styles.pricingTableTitle}>
          {formatTitleWithHighlightedWords(block.title)}
        </p>
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th></th> {/* Label for the features column */}
                {block.plans.map(plan => (
                  <th
                    key={plan._key}
                    className={plan.isHighlighted ? styles.highlighted : ""}
                  >
                    <p className={styles.pretitle}>{plan.planPretitle}</p>
                    <p className={styles.planName}>{plan.planName}</p>
                    <p className={styles.price}>{plan.planPrice}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.plans[0]?.features.map((feature, index) => (
                <tr key={feature._key}>
                  <td>{feature.featureName}</td>{" "}
                  {/* Wider column for features */}
                  {block.plans.map((plan, planIndex) => (
                    <td
                      key={`${plan._key}-${index}`}
                      className={`${plan.isHighlighted ? styles.highlighted : styles.default}`}
                    >
                      {plan.features[index]?.availability === "available" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="34"
                          height="25"
                          viewBox="0 0 34 25"
                          fill="none"
                        >
                          <path
                            d="M1.63672 15.0239L10.4244 23.8116L32.3936 1.84241"
                            stroke="#091728"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="26"
                          height="26"
                          viewBox="0 0 26 26"
                          fill="none"
                        >
                          <path
                            d="M1.68945 1.95129L24.3422 24.6035"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M1.69141 24.6038L24.3436 1.95105"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                {block.plans.map(plan => (
                  <td
                    key={plan._key}
                    className={plan.isHighlighted ? styles.highlighted : ""}
                  >
                    <div className={styles.buttonWrapper}>
                      <ButtonModal>{plan.buttonText}</ButtonModal>
                    </div>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PricingTableComponent;
