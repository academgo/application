"use client";

import React, { useEffect, useMemo, useState, useId } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import styles from "./MultiStepFormBlock.module.scss";
import { QuizBlock } from "@/types/quizBlock";

// ✅ фиксированные картинки для шага 1
import imageParent from "./image-parent.jpg";
import imageStudent from "./image-student.jpg";

type Props = {
  lang: string;
  quizBlock: QuizBlock;
};

type DynamicFormValues = Record<string, any> & {
  question1: string;
  whatsapp: string;
  agreedToPolicy: boolean;
};

const MultiStepFormBlock: React.FC<Props> = ({ lang, quizBlock }) => {
  const router = useRouter();
  const uniqueId = useId();

  const dynamicQuestions = quizBlock?.questions ?? [];
  const dynamicCount = dynamicQuestions.length;

  const TOTAL_QUESTION_STEPS = 1 + dynamicCount; // 1 фикс + N динамика
  const LAST_STEP = TOTAL_QUESTION_STEPS + 1; // финал

  const [step, setStep] = useState(1);

  const initialValues = useMemo<DynamicFormValues>(() => {
    const base: DynamicFormValues = {
      question1: "",
      whatsapp: "",
      agreedToPolicy: false
    };

    for (const q of dynamicQuestions) {
      base[`q_${q._key}`] = "";
    }

    return base;
  }, [dynamicQuestions]);

  const validationSchemaByStep = useMemo(() => {
    const schemas: Yup.ObjectSchema<any>[] = [];

    // step 1 fixed
    schemas.push(
      Yup.object({
        question1: Yup.string().required(
          lang === "en" ? "This field is required" : "Поле обязательно"
        )
      })
    );

    // step 2..N+1 dynamic
    for (const q of dynamicQuestions) {
      const fieldName = `q_${q._key}`;
      schemas.push(
        Yup.object({
          [fieldName]: Yup.string().required(
            lang === "en" ? "This field is required" : "Поле обязательно"
          )
        })
      );
    }

    // final
    schemas.push(
      Yup.object({
        whatsapp: Yup.string().required(
          lang === "en" ? "This field is required" : "Поле обязательно"
        ),
        agreedToPolicy: Yup.boolean()
          .oneOf(
            [true],
            lang === "en"
              ? "You must accept the terms and conditions"
              : "Вы должны принять условия"
          )
          .required(
            lang === "en"
              ? "You must accept the terms and conditions"
              : "Вы должны принять условия"
          )
      })
    );

    return schemas;
  }, [dynamicQuestions, lang]);

  const [filled, setFilled] = useState({ whatsapp: false });

  useEffect(() => {
    const interval = setInterval(() => {
      const input = document.getElementById("whatsapp") as HTMLInputElement;
      if (input && input.value) setFilled(f => ({ ...f, whatsapp: true }));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilled(prev => ({ ...prev, [name]: value.trim() !== "" }));
  };

  const handleNext = async (
    validateForm: () => Promise<Record<string, any>>
  ) => {
    const errors = await validateForm();

    if (Object.keys(errors).length === 0) {
      setStep(s => Math.min(s + 1, LAST_STEP));
      return;
    }

    Object.keys(errors).forEach(key => {
      const element = document.querySelector(`[name="${key}"]`);
      if (element) element.classList.add(styles.errorHighlight);
    });
  };

  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = async (
    values: DynamicFormValues,
    { setSubmitting }: FormikHelpers<DynamicFormValues>
  ) => {
    setSubmitting(true);

    try {
      const quizAnswers = [
        {
          name: "question1",
          label:
            lang === "en" ? "Who fills out the form?" : "Кто заполняет анкету?",
          value: values.question1 || ""
        },
        ...dynamicQuestions.map(q => {
          const fieldName = `q_${q._key}`;
          return {
            name: fieldName, // технический ключ (стабильный)
            label: q.questionTitle, // текст вопроса (для письма)
            value: values[fieldName] || ""
          };
        })
      ];

      await axios.post("/api/quiz-email", {
        whatsapp: values.whatsapp,
        quizAnswers,
        lang,
        url: typeof window !== "undefined" ? window.location.href : ""
      });

      router.push(lang === "ru" ? "/ru/success" : "/success");
    } catch (error) {
      alert(lang === "ru" ? "Ошибка отправки" : "Error sending");
    } finally {
      setSubmitting(false);
    }
  };

  const progressPercentage =
    step > 1
      ? (Math.min(step - 1, TOTAL_QUESTION_STEPS) / TOTAL_QUESTION_STEPS) * 100
      : 0;

  const isDynamicQuestionStep = step >= 2 && step <= TOTAL_QUESTION_STEPS;
  const dynamicIndex = step - 2;
  const currentDynamicQuestion = isDynamicQuestionStep
    ? dynamicQuestions[dynamicIndex]
    : null;

  // ✅ ВАЖНО: вот здесь единственное место, где надо совпадение с типами
  // Если у вас поле называется НЕ question — поменяйте на своё.
  const getQuestionText = (q: any) =>
    q.questionTitle ?? q.title ?? q.question ?? q.text ?? q.label ?? "";

  const currentFieldName = currentDynamicQuestion
    ? `q_${currentDynamicQuestion._key}`
    : "";

  return (
    <div className={styles.multiStepForm}>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchemaByStep[Math.max(0, step - 1)]}
        onSubmit={step === LAST_STEP ? handleSubmit : async () => {}}
      >
        {({ isSubmitting, values, validateForm, setFieldValue }) => (
          <Form className={styles.customForm}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progressPercentage}%` }}
              />
              {step > 1 && (
                <div className={styles.progressText}>
                  {lang === "en"
                    ? `Step ${Math.min(step - 1, TOTAL_QUESTION_STEPS)} of ${TOTAL_QUESTION_STEPS}`
                    : `Шаг ${Math.min(step - 1, TOTAL_QUESTION_STEPS)} из ${TOTAL_QUESTION_STEPS}`}
                </div>
              )}
            </div>

            {/* ✅ STEP 1 (фиксированный) */}
            {step === 1 && (
              <div className={styles.questionWrapper}>
                <div className={styles.topWrapper}>
                  <fieldset>
                    <div className={styles.questionData}>
                      <div className={styles.questionNumber}>
                        {lang === "en" ? "Question 1" : "Вопрос 1"}
                      </div>
                      <legend className={styles.questionTitle}>
                        {lang === "en"
                          ? "Who fills out the form?"
                          : "Кто заполняет анкету?"}
                      </legend>
                    </div>

                    <div
                      role="group"
                      aria-labelledby="question1"
                      className={styles.customRadios}
                    >
                      <div className={styles.customRadio}>
                        <label>
                          <Field
                            type="radio"
                            name="question1"
                            value={lang === "en" ? "parent" : "Родитель"}
                          />
                          <div className={styles.answerImg}>
                            <Image
                              alt={lang === "en" ? "Parent" : "Родитель"}
                              src={imageParent}
                            />
                          </div>
                          <div className={styles.pseudoRadioData}>
                            <div className={styles.pseudoRadio} />
                            <p className={styles.pseudoRadioText}>
                              {lang === "en" ? "Parent" : "Родитель"}
                            </p>
                          </div>
                        </label>
                      </div>

                      <div className={styles.customRadio}>
                        <label>
                          <Field
                            type="radio"
                            name="question1"
                            value={
                              lang === "en" ? "Enrollee" : "Сам абитуриент"
                            }
                          />
                          <div className={styles.answerImg}>
                            <Image
                              alt={
                                lang === "en" ? "Enrollee" : "Сам абитуриент"
                              }
                              src={imageStudent}
                            />
                          </div>
                          <div className={styles.pseudoRadioData}>
                            <div className={styles.pseudoRadio} />
                            <p className={styles.pseudoRadioText}>
                              {lang === "en" ? "Enrollee" : "Сам абитуриент"}
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <ErrorMessage name="question1" component="div" />
                  </fieldset>
                </div>

                <div className={styles.buttonsBlock}>
                  <button
                    type="button"
                    onClick={() => handleNext(validateForm)}
                    className={styles.buttonNext}
                  >
                    {lang === "en" ? "Next" : "Далее"}
                  </button>
                </div>
              </div>
            )}

            {/* ✅ dynamic steps */}
            {currentDynamicQuestion && (
              <div className={styles.questionWrapper}>
                <div className={styles.topWrapper}>
                  <fieldset>
                    <div className={styles.questionData}>
                      <div className={styles.questionNumber}>
                        {lang === "en" ? `Question ${step}` : `Вопрос ${step}`}
                      </div>
                      <legend className={styles.questionTitle}>
                        {getQuestionText(currentDynamicQuestion)}
                      </legend>
                    </div>

                    <div
                      role="group"
                      aria-labelledby={currentFieldName}
                      className={styles.customRadios}
                    >
                      {currentDynamicQuestion.options?.map((opt: any) => (
                        <div
                          key={opt._key}
                          className={`${styles.customRadio} ${styles.radioGray}`}
                        >
                          <label>
                            <Field
                              type="radio"
                              name={currentFieldName}
                              value={opt.label}
                            />
                            <div className={styles.pseudoRadioData}>
                              <div
                                className={styles.pseudoRadio}
                                style={{ backgroundColor: "#fff" }}
                              />
                              <p className={styles.pseudoRadioText}>
                                {opt.label}
                              </p>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>

                    <ErrorMessage name={currentFieldName} component="div" />
                  </fieldset>
                </div>

                <div className={styles.buttonsBlock}>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className={styles.buttonBack}
                  >
                    {lang === "en" ? "Previous" : "Назад"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNext(validateForm)}
                    className={styles.buttonNext}
                  >
                    {lang === "en" ? "Next" : "Далее"}
                  </button>
                </div>
              </div>
            )}

            {/* ✅ final step (фикс) */}
            {step === LAST_STEP && (
              <div className={styles.questionWrapper}>
                <div className={styles.topWrapper}>
                  <h3 className={styles.finalTitle}>{quizBlock.finalTitle}</h3>
                </div>

                <div className={styles.formSending}>
                  <p className={styles.formTitle}>{quizBlock.formTitle}</p>

                  <div className={styles.finalForm}>
                    <div className={styles.inputWrapper}>
                      <label
                        htmlFor="whatsapp"
                        className={`${styles.label} ${styles.labelPhone} ${
                          filled.whatsapp ? styles.filled : ""
                        }`}
                      >
                        {quizBlock.inputLabel}
                      </label>

                      <PhoneInput
                        id="whatsapp"
                        name="whatsapp"
                        className={styles.inputField}
                        onBlur={handleBlur}
                        onChange={value => setFieldValue("whatsapp", value)}
                      />

                      <ErrorMessage
                        name="whatsapp"
                        component="div"
                        className={styles.error}
                      />
                    </div>

                    <div className={styles.customCheckbox}>
                      <Field
                        type="checkbox"
                        name="agreedToPolicy"
                        id={`agreedToPolicy-${uniqueId}`}
                      />
                      <label htmlFor={`agreedToPolicy-${uniqueId}`}>
                        {lang === "en"
                          ? "I agree to the terms"
                          : "Согласен с условиями"}{" "}
                        <Link
                          className={styles.policyLink}
                          href={
                            lang === "en"
                              ? "/en/privacy-policy"
                              : "/ru/politika-konfidencialnosti"
                          }
                          target="_blank"
                        >
                          {lang === "en"
                            ? "Privacy Policy"
                            : "Политики конфиденциальности"}
                        </Link>
                      </label>
                    </div>

                    <ErrorMessage
                      name="agreedToPolicy"
                      component="div"
                      className={styles.errorCheckbox}
                    />

                    <button
                      type="submit"
                      className={styles.sentBtn}
                      disabled={isSubmitting || !values.agreedToPolicy}
                    >
                      {isSubmitting ? (
                        <div className={styles.loader} />
                      ) : (
                        quizBlock.buttonText
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MultiStepFormBlock;
