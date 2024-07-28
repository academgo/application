"use client";
import React, { useEffect, useState, useId } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./MultiStepForm.module.scss";

import imageParent from "./image-parent.jpg";
import imageStudent from "./image-student.jpg";

type FormData = {
  question1: string;
  question2: string;
  question3: string;
  question4: string;
  whatsapp: string;
  agreedToPolicy: boolean;
};

type Props = {
  lang: string;
  formTitle: string;
  inputLabel: string;
  buttonText: string;
  finalTitle: string;
};

const MultiStepForm = ({
  lang,
  inputLabel,
  buttonText,
  finalTitle,
  formTitle
}: Props) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    whatsapp: "",
    agreedToPolicy: false
  });

  const uniqueId = useId();
  const router = useRouter();

  const [filled, setFilled] = useState({
    whatsapp: false
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const input = document.getElementById("whatsapp") as HTMLInputElement;
      if (input && input.value) {
        setFilled(f => ({ ...f, whatsapp: true }));
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilled(prev => ({ ...prev, [name]: value.trim() !== "" }));
  };

  const validationSchema = [
    Yup.object({
      question1: Yup.string().required("This field is required")
    }),
    Yup.object({
      question2: Yup.string().required("This field is required")
    }),
    Yup.object({
      question3: Yup.string().required("This field is required")
    }),
    Yup.object({
      question4: Yup.string().required("This field is required")
    }),
    Yup.object({
      whatsapp: Yup.string().required("This field is required"),
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
  ];

  const handleNext = async (values: FormData, validateForm: any) => {
    const errors = await validateForm();
    if (Object.keys(errors).length === 0) {
      setFormData(prev => ({ ...prev, ...values }));
      setStep(step + 1);
    } else {
      // Highlight errors
      Object.keys(errors).forEach(key => {
        const element = document.querySelector(`[name="${key}"]`);
        if (element) {
          element.classList.add(styles.errorHighlight);
        }
      });
    }
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (
    values: FormData,
    { setSubmitting }: FormikHelpers<FormData>
  ) => {
    setSubmitting(true);
    try {
      await axios.post("/api/email", values);
      router.push("/success");
    } catch (error) {
      alert("Error sending email");
    } finally {
      setSubmitting(false);
    }
  };

  const progressPercentage = (step > 1 ? (step - 1) / 4 : 0) * 100;

  return (
    <div className={styles.multiStepForm}>
      <Formik
        initialValues={formData}
        validationSchema={validationSchema[step - 1]}
        onSubmit={
          step === 5
            ? handleSubmit
            : (values, actions) => handleNext(values, actions.validateForm)
        }
      >
        {({ isSubmitting, values, validateForm }) => (
          <Form className={styles.customForm}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progressPercentage}%` }}
              />
              {step > 1 && (
                <div className={styles.progressText}>
                  {lang === "en"
                    ? `Step ${step - 1} of 4`
                    : `Шаг ${step - 1} из 4`}
                </div>
              )}
            </div>
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
                            <div className={styles.pseudoRadio}></div>
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
                            <div className={styles.pseudoRadio}></div>
                            <p>
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
                    onClick={() => handleNext(values, validateForm)}
                    className={styles.buttonNext}
                  >
                    {lang === "en" ? "Next" : "Далее"}
                  </button>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className={styles.questionWrapper}>
                <div className={styles.topWrapper}>
                  <fieldset>
                    <div className={styles.questionData}>
                      <div className={styles.questionNumber}>
                        {lang === "en" ? "Question 2" : "Вопрос 2"}
                      </div>
                      <legend className={styles.questionTitle}>
                        {lang === "en"
                          ? "What level of education are you interested in?"
                          : "Какая степень образования вас интересует?"}
                      </legend>
                    </div>
                    <div
                      role="group"
                      aria-labelledby="question2"
                      className={styles.customRadios}
                    >
                      <div
                        className={`${styles.customRadio} ${styles.radioGray}`}
                      >
                        <label>
                          <Field
                            type="radio"
                            name="question2"
                            value={lang === "en" ? "Bachelor" : "Бакалавр"}
                          />
                          <div className={styles.pseudoRadioData}>
                            <div
                              className={styles.pseudoRadio}
                              style={{ backgroundColor: "#fff" }}
                            ></div>
                            <p className={styles.pseudoRadioText}>
                              {lang === "en" ? "Bachelor" : "Бакалавр"}
                            </p>
                          </div>
                        </label>
                      </div>
                      <div
                        className={`${styles.customRadio} ${styles.radioGray}`}
                      >
                        <label>
                          <Field
                            type="radio"
                            name="question2"
                            value={lang === "en" ? "Master" : "Магистратура"}
                          />
                          <div className={styles.pseudoRadioData}>
                            <div
                              className={styles.pseudoRadio}
                              style={{ backgroundColor: "#fff" }}
                            ></div>
                            <p className={styles.pseudoRadioText}>
                              {lang === "en" ? "Master" : "Магистратура"}
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                    <ErrorMessage name="question2" component="div" />
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
                    onClick={() => handleNext(values, validateForm)}
                    className={styles.buttonNext}
                  >
                    {lang === "en" ? "Next" : "Далее"}
                  </button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className={styles.questionWrapper}>
                <div className={styles.topWrapper}>
                  <fieldset>
                    <div className={styles.questionData}>
                      <div className={styles.questionNumber}>
                        {lang === "en" ? "Question 3" : "Вопрос 3"}
                      </div>
                      <legend className={styles.questionTitle}>
                        {lang === "en"
                          ? "When are you planning to start studying?"
                          : "Когда планируете начать учебу?"}
                      </legend>
                    </div>
                    <div
                      role="group"
                      aria-labelledby="question3"
                      className={styles.customRadios}
                    >
                      <div
                        className={`${styles.customRadio} ${styles.radioGray}`}
                      >
                        <label>
                          <Field
                            type="radio"
                            name="question3"
                            value={
                              lang === "en"
                                ? "As soon as possible"
                                : "Как можно скорее"
                            }
                          />
                          <div className={styles.pseudoRadioData}>
                            <div
                              className={styles.pseudoRadio}
                              style={{ backgroundColor: "#fff" }}
                            ></div>
                            <p className={styles.pseudoRadioText}>
                              {lang === "en"
                                ? "As soon as possible"
                                : "Как можно скорее"}
                            </p>
                          </div>
                        </label>
                      </div>
                      <div
                        className={`${styles.customRadio} ${styles.radioGray}`}
                      >
                        <label>
                          <Field
                            type="radio"
                            name="question3"
                            value={
                              lang === "en" ? "October 2024" : "Октябрь 2024"
                            }
                          />
                          <div className={styles.pseudoRadioData}>
                            <div
                              className={styles.pseudoRadio}
                              style={{ backgroundColor: "#fff" }}
                            ></div>
                            <p className={styles.pseudoRadioText}>
                              {lang === "en" ? "October 2024" : "Октябрь 2024"}
                            </p>
                          </div>
                        </label>
                      </div>
                      <div
                        className={`${styles.customRadio} ${styles.radioGray}`}
                      >
                        <label>
                          <Field
                            type="radio"
                            name="question3"
                            value={lang === "en" ? "March 2025" : "Март 2025"}
                          />
                          <div className={styles.pseudoRadioData}>
                            <div
                              className={styles.pseudoRadio}
                              style={{ backgroundColor: "#fff" }}
                            ></div>
                            <p className={styles.pseudoRadioText}>
                              {lang === "en" ? "March 2025" : "Март 2025"}
                            </p>
                          </div>
                        </label>
                      </div>
                      <div
                        className={`${styles.customRadio} ${styles.radioGray}`}
                      >
                        <label>
                          <Field
                            type="radio"
                            name="question3"
                            value={lang === "en" ? "Later" : "Позже"}
                          />
                          <div className={styles.pseudoRadioData}>
                            <div
                              className={styles.pseudoRadio}
                              style={{ backgroundColor: "#fff" }}
                            ></div>
                            <p className={styles.pseudoRadioText}>
                              {lang === "en" ? "Later" : "Позже"}
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                    <ErrorMessage name="question3" component="div" />
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
                    onClick={() => handleNext(values, validateForm)}
                    className={styles.buttonNext}
                  >
                    {lang === "en" ? "Next" : "Далее"}
                  </button>
                </div>
              </div>
            )}
            {step === 4 && (
              <div className={styles.questionWrapper}>
                <div className={styles.topWrapper}>
                  <fieldset>
                    <div className={styles.questionData}>
                      <div className={styles.questionNumber}>
                        {lang === "en" ? "Question 4" : "Вопрос 4"}
                      </div>
                      <legend className={styles.questionTitle}>
                        {lang === "en"
                          ? "What is your study budget per year?"
                          : "Какой ваш бюджет на обучение в год?"}
                      </legend>
                    </div>
                    <div
                      role="group"
                      aria-labelledby="question4"
                      className={styles.customRadios}
                    >
                      <div
                        className={`${styles.customRadio} ${styles.radioGray}`}
                      >
                        <label>
                          <Field
                            type="radio"
                            name="question4"
                            value={lang === "en" ? "up to 2000€" : "до 2000€"}
                          />
                          <div className={styles.pseudoRadioData}>
                            <div
                              className={styles.pseudoRadio}
                              style={{ backgroundColor: "#fff" }}
                            ></div>
                            <p className={styles.pseudoRadioText}>
                              {lang === "en" ? "up to 2000€" : "до 2000€"}
                            </p>
                          </div>
                        </label>
                      </div>
                      <div
                        className={`${styles.customRadio} ${styles.radioGray}`}
                      >
                        <label>
                          <Field
                            type="radio"
                            name="question4"
                            value="2000€-4000€"
                          />
                          <div className={styles.pseudoRadioData}>
                            <div
                              className={styles.pseudoRadio}
                              style={{ backgroundColor: "#fff" }}
                            ></div>
                            <p className={styles.pseudoRadioText}>
                              {lang === "en" ? "2000€-4000€" : "2000€-4000€"}
                            </p>
                          </div>
                        </label>
                      </div>
                      <div
                        className={`${styles.customRadio} ${styles.radioGray}`}
                      >
                        <label>
                          <Field type="radio" name="question4" value="4000€+" />
                          <div className={styles.pseudoRadioData}>
                            <div
                              className={styles.pseudoRadio}
                              style={{ backgroundColor: "#fff" }}
                            ></div>
                            <p className={styles.pseudoRadioText}>
                              {lang === "en" ? "4000€+" : "4000€+"}
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                    <ErrorMessage name="question4" component="div" />
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
                    onClick={() => handleNext(values, validateForm)}
                    className={styles.buttonNext}
                  >
                    {lang === "en" ? "Next" : "Далее"}
                  </button>
                </div>
              </div>
            )}
            {step === 5 && (
              <>
                <div className={styles.questionWrapper}>
                  <div className={styles.topWrapper}>
                    <h3 className={styles.finalTitle}>{finalTitle}</h3>
                  </div>
                  <div className={styles.formSending}>
                    <p className={styles.formTitle}>{formTitle}</p>
                    <div className={styles.finalForm}>
                      <div className={styles.inputWrapper}>
                        <label
                          htmlFor="whatsapp"
                          className={`${styles.label} 
                          ${filled.whatsapp ? styles.filled : ""}`}
                        >
                          {inputLabel}
                        </label>
                        <Field
                          id="whatsapp"
                          name="whatsapp"
                          type="text"
                          className={`${styles.inputField} w-full rounded-md`}
                          onBlur={handleBlur}
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
                                ? "/privacy-policy"
                                : "/politika-konfidencialnosti"
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
                          <div className={styles.loader}></div>
                        ) : (
                          buttonText
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MultiStepForm;
