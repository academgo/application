"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { urlFor } from "@/sanity/image";

import styles from "./MultiStepFormBlock.module.scss";
import { QuizBlock } from "@/types/quizBlock";
import { trackLead } from "@/lib/trackLead";
import {
  UNDECIDED_STUDY_COUNTRY,
  studyCountryCodeByName
} from "@/lib/studyDestination";

type Props = {
  lang: string;
  quizBlock: QuizBlock;
  /** Названия стран для вопроса, где варианты берутся из раздела Country */
  countryOptions?: string[];
  /** Ссылки мессенджеров из контактов футера — запасные, если в блоке не заданы свои */
  messengers?: { telegram?: string; whatsapp?: string };
  /** Готовый ряд иконок соцсетей, собранный на сервере */
  socials?: React.ReactNode;
};

type DynamicFormValues = Record<string, string>;

type LeadChannel = "telegram" | "whatsapp" | "none";

// Сколько воздуха оставить над блоком при перемотке: примерно высота шапки
const SCROLL_OFFSET = 100;

// Запасные тексты финального экрана: показываются, пока поля в CMS не заполнены,
// чтобы кнопка не осталась без подписи сразу после выкладки
const finalFallback = (lang: string) =>
  lang === "en"
    ? {
        eyebrow: "Form completed",
        title: "Thank you! One step left",
        description:
          "Message us and we will send a shortlist of universities for your budget and answer your questions.",
        telegram: "Message us on Telegram",
        whatsapp: "Message us on WhatsApp",
        submit: "Send the request",
        note: "We reply within one business day",
        policyPrefix: "By clicking the button you agree to the",
        policyLink: "Privacy Policy"
      }
    : {
        eyebrow: "Анкета заполнена",
        title: "Спасибо! Остался один шаг",
        description:
          "Напишите нам — пришлём подборку вузов под ваш бюджет и ответим на вопросы.",
        telegram: "Написать в Telegram",
        whatsapp: "Написать в WhatsApp",
        submit: "Отправить заявку",
        note: "Отвечаем в течение рабочего дня",
        policyPrefix: "Нажимая кнопку, вы соглашаетесь с",
        policyLink: "политикой конфиденциальности"
      };

const MultiStepFormBlock: React.FC<Props> = ({
  lang,
  quizBlock,
  countryOptions = [],
  messengers,
  socials
}) => {
  const router = useRouter();
  const texts = finalFallback(lang);

  const questions = useMemo(
    () =>
      (quizBlock?.questions ?? []).map(question => {
        if (question.optionsSource !== "countries") return question;

        const labels = [...countryOptions];
        if (question.extraOption) labels.push(question.extraOption);

        return {
          ...question,
          options: labels.map((label, index) => ({
            _key: `${question._key}-c${index}`,
            label
          }))
        };
      }),
    [quizBlock?.questions, countryOptions]
  );

  const totalQuestions = questions.length;
  const LAST_STEP = totalQuestions + 1; // финальный экран идёт после вопросов

  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Шаги разной высоты, и без этого экран прыгает: после каждого «Далее»
  // возвращаем начало блока на одно и то же место
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const node = blockRef.current;
    if (!node) return;

    const top =
      node.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, [step]);

  const initialValues = useMemo<DynamicFormValues>(() => {
    const base: DynamicFormValues = {};
    for (const question of questions) base[`q_${question._key}`] = "";

    return base;
  }, [questions]);

  const validationSchemaByStep = useMemo(
    () =>
      questions.map(question =>
        Yup.object({
          [`q_${question._key}`]: Yup.string().required(
            lang === "en" ? "This field is required" : "Поле обязательно"
          )
        })
      ),
    [questions, lang]
  );

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

  // Заявка уходит по клику на кнопку мессенджера. Ссылка остаётся настоящей
  // ссылкой с target="_blank", а письмо отправляется запросом с keepalive —
  // он доживает до конца, даже когда вкладка уже ушла в мессенджер. Если ждать
  // ответ сервера и открывать мессенджер потом, браузер считает это попапом
  // и блокирует.
  const sendLead = (values: DynamicFormValues, channel: LeadChannel) => {
    if (sent) return;
    setSent(true);

    const quizAnswers = questions.map(question => {
      const fieldName = `q_${question._key}`;

      return {
        name: fieldName, // технический ключ (стабильный)
        label: question.questionTitle, // текст вопроса (для письма)
        value: values[fieldName] || ""
      };
    });

    // Ответ на вопрос о стране — это и есть страна обучения заявки;
    // «Ещё не выбрал(а)» и любой вариант не из списка стран — «не решил»
    const countryQuestion = questions.find(
      question => question.optionsSource === "countries"
    );
    const countryAnswer = countryQuestion
      ? values[`q_${countryQuestion._key}`]
      : undefined;
    const studyCountry = countryAnswer
      ? studyCountryCodeByName(countryAnswer) || UNDECIDED_STUDY_COUNTRY
      : undefined;

    try {
      fetch("/api/quiz-email", {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizAnswers,
          channel,
          lang,
          studyCountry,
          url: typeof window !== "undefined" ? window.location.href : ""
        })
      }).catch(() => {});
    } catch {
      // письмо не ушло — мессенджер всё равно открываем, человека не теряем
    }

    trackLead("quiz", lang, studyCountry);
    router.push(lang === "ru" ? "/ru/success" : "/success");
  };

  const progressPercentage = totalQuestions
    ? (Math.min(step - 1, totalQuestions) / totalQuestions) * 100
    : 0;

  const currentQuestion = step <= totalQuestions ? questions[step - 1] : null;
  const currentFieldName = currentQuestion ? `q_${currentQuestion._key}` : "";

  const questionImageUrl = currentQuestion?.image
    ? urlFor(currentQuestion.image).width(1200).url()
    : "";

  const mode = quizBlock?.finalMode || "telegram";
  const telegramHref = quizBlock?.telegramLink || messengers?.telegram || "";
  const whatsappHref = quizBlock?.whatsappLink || messengers?.whatsapp || "";
  const showTelegram =
    (mode === "telegram" || mode === "both") && Boolean(telegramHref);
  const showWhatsapp =
    (mode === "whatsapp" || mode === "both") && Boolean(whatsappHref);
  // Ни одной ссылки — ни в блоке, ни в футере. Показываем обычную кнопку,
  // чтобы ответы всё равно дошли письмом, а не потерялись
  const showPlainSubmit = !showTelegram && !showWhatsapp;
  // Пульсирующий ореол уместен у одной кнопки; у двух два ореола дерутся за взгляд
  const pulse = showTelegram !== showWhatsapp;

  const isFinalStep = step === LAST_STEP;

  return (
    <div
      ref={blockRef}
      className={styles.multiStepForm}
      // по этой метке родительские блоки убирают свой фон и паддинги:
      // на финальном экране карточка сама себе фон
      data-quiz-final={isFinalStep ? "true" : undefined}
    >
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchemaByStep[step - 1]}
        onSubmit={async () => {}}
      >
        {({ values, validateForm }) => (
          <Form className={styles.customForm}>
            {currentQuestion && (
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progressPercentage}%` }}
                />
                <div className={styles.progressText}>
                  {lang === "en"
                    ? `Step ${step} of ${totalQuestions}`
                    : `Шаг ${step} из ${totalQuestions}`}
                </div>
              </div>
            )}

            {currentQuestion && (
              <div className={styles.questionWrapper}>
                <div className={styles.topWrapper}>
                  <fieldset>
                    <div className={styles.questionData}>
                      <div className={styles.questionNumber}>
                        {lang === "en" ? `Question ${step}` : `Вопрос ${step}`}
                      </div>
                      <legend className={styles.questionTitle}>
                        {currentQuestion.questionTitle}
                      </legend>
                    </div>

                    {questionImageUrl && (
                      <div className={styles.questionImage}>
                        <Image
                          src={questionImageUrl}
                          alt={
                            currentQuestion.imageAlt ||
                            currentQuestion.questionTitle
                          }
                          width={1200}
                          height={675}
                          sizes="(max-width: 768px) 100vw, 720px"
                          className={styles.questionImageTag}
                        />
                      </div>
                    )}

                    <div
                      role="group"
                      aria-labelledby={currentFieldName}
                      className={styles.customRadios}
                    >
                      {currentQuestion.options?.map((opt: any) => {
                        const optionImageUrl = opt.image
                          ? urlFor(opt.image).width(600).url()
                          : "";

                        return (
                          <div
                            key={opt._key}
                            className={`${styles.customRadio} ${
                              optionImageUrl ? "" : styles.radioGray
                            }`}
                          >
                            <label>
                              <Field
                                type="radio"
                                name={currentFieldName}
                                value={opt.label}
                              />
                              {optionImageUrl && (
                                <div className={styles.answerImg}>
                                  <Image
                                    src={optionImageUrl}
                                    alt={opt.label}
                                    width={600}
                                    height={600}
                                    sizes="(max-width: 768px) 50vw, 300px"
                                  />
                                </div>
                              )}
                              <div className={styles.pseudoRadioData}>
                                <div
                                  className={styles.pseudoRadio}
                                  style={
                                    optionImageUrl
                                      ? undefined
                                      : { backgroundColor: "#fff" }
                                  }
                                />
                                <p className={styles.pseudoRadioText}>
                                  {opt.label}
                                </p>
                              </div>
                            </label>
                          </div>
                        );
                      })}
                    </div>

                    <ErrorMessage name={currentFieldName} component="div" />
                  </fieldset>
                </div>

                <div className={styles.buttonsBlock}>
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className={styles.buttonBack}
                    >
                      {lang === "en" ? "Previous" : "Назад"}
                    </button>
                  )}

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

            {isFinalStep && (
              <div className={styles.questionWrapper}>
                <div className={styles.finalCard}>
                  <p className={styles.finalEyebrow}>
                    {quizBlock?.finalEyebrow || texts.eyebrow}
                  </p>

                  <h3 className={styles.finalTitle}>
                    {quizBlock?.finalTitle || texts.title}
                  </h3>

                  <p className={styles.finalDescription}>
                    {quizBlock?.finalDescription || texts.description}
                  </p>

                  <div className={styles.finalActions}>
                    {showTelegram && (
                      <a
                        href={telegramHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.messengerBtn} ${styles.messengerTelegram}`}
                        onClick={() => sendLead(values, "telegram")}
                      >
                        {pulse && (
                          <span aria-hidden="true" className={styles.pulse} />
                        )}
                        <FaTelegramPlane
                          aria-hidden="true"
                          className={styles.messengerIcon}
                        />
                        <span className={styles.messengerLabel}>
                          {quizBlock?.telegramLabel || texts.telegram}
                        </span>
                      </a>
                    )}

                    {showWhatsapp && (
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.messengerBtn} ${styles.messengerWhatsapp}`}
                        onClick={() => sendLead(values, "whatsapp")}
                      >
                        {pulse && (
                          <span aria-hidden="true" className={styles.pulse} />
                        )}
                        <FaWhatsapp
                          aria-hidden="true"
                          className={styles.messengerIcon}
                        />
                        <span className={styles.messengerLabel}>
                          {quizBlock?.whatsappLabel || texts.whatsapp}
                        </span>
                      </a>
                    )}

                    {showPlainSubmit && (
                      <button
                        type="button"
                        className={`${styles.messengerBtn} ${styles.messengerTelegram}`}
                        onClick={() => sendLead(values, "none")}
                      >
                        <span className={styles.messengerLabel}>
                          {quizBlock?.telegramLabel || texts.submit}
                        </span>
                      </button>
                    )}
                  </div>

                  <p className={styles.finalNote}>
                    {quizBlock?.finalNote || texts.note}
                  </p>

                  <p className={styles.finalPolicy}>
                    {texts.policyPrefix}{" "}
                    <Link
                      className={styles.policyLink}
                      href={
                        lang === "en"
                          ? "/privacy-policy"
                          : "/ru/politika-konfidencialnosti"
                      }
                      target="_blank"
                    >
                      {texts.policyLink}
                    </Link>
                  </p>

                  {quizBlock?.showSocials !== false && socials}
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
