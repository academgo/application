"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { urlFor } from "@/sanity/image";

import MessengerCta from "../MessengerCta/MessengerCta";
import styles from "./MultiStepFormBlock.module.scss";
import { QuizBlock } from "@/types/quizBlock";
import { trackLead } from "@/lib/trackLead";
import {
  UNDECIDED_STUDY_COUNTRY,
  detectStudyDestinationCode,
  studyCountryCodeByName,
  studyCountryName,
  studyCountryNameIn
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

// Сколько держится одна строка на экране подбора
const ANALYZE_STEP_MS = 800;

// Запасные тексты финального экрана: показываются, пока поля в CMS не заполнены,
// чтобы кнопка не осталась без подписи сразу после выкладки
const finalFallback = (lang: string) =>
  lang === "en"
    ? {
        eyebrow: "Form completed",
        title: "Thank you! One step left",
        description:
          "Message us and we will send a shortlist of universities for your budget and answer your questions.",
        note: "We reply within one business day",
        loadingTitle: "Preparing your shortlist",
        loadingSteps: ["Analysing your answers", "Matching universities"],
        country: "your chosen country",
        countryIn: "your chosen country"
      }
    : {
        eyebrow: "Анкета заполнена",
        title: "Спасибо! Остался один шаг",
        description:
          "Напишите нам — пришлём подборку вузов под ваш бюджет и ответим на вопросы.",
        note: "Отвечаем в течение рабочего дня",
        loadingTitle: "Готовим подборку",
        loadingSteps: ["Анализируем ваши ответы", "Подбираем вузы"],
        country: "выбранное направление",
        countryIn: "выбранную страну"
      };

const MultiStepFormBlock: React.FC<Props> = ({
  lang,
  quizBlock,
  countryOptions = [],
  messengers,
  socials
}) => {
  // Запоминаем: объект пересоздавался на каждом рендере, из-за чего таймеры
  // экрана подбора сбрасывались и он висел дольше задуманного
  const texts = useMemo(() => finalFallback(lang), [lang]);

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
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzingIndex, setAnalyzingIndex] = useState(0);
  const [pageCountryCode, setPageCountryCode] = useState<string | undefined>();
  const blockRef = useRef<HTMLDivElement>(null);

  // Шаги разной высоты, и без этого экран прыгает: после каждого «Далее»
  // возвращаем начало блока на одно и то же место.
  // Первый экран не трогаем совсем: флаг «первый рендер» тут не годится —
  // в разработке React монтирует компонент дважды, и второй проход
  // прокручивал страницу к квизу сразу после открытия
  useEffect(() => {
    if (step === 1 && !analyzing) return;

    const node = blockRef.current;
    if (!node) return;

    const top =
      node.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, [step, analyzing]);

  // Страна страницы — запасной вариант подстановки, если про направление
  // в квизе не спрашивают. Читаем адрес после отрисовки, не на сервере
  useEffect(() => {
    setPageCountryCode(detectStudyDestinationCode(window.location.href));
  }, []);

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

  const loadingSteps = useMemo(() => {
    const fromCms = (quizBlock?.loadingSteps || [])
      .map(line => (line || "").trim())
      .filter(Boolean);

    return fromCms.length ? fromCms : texts.loadingSteps;
  }, [quizBlock?.loadingSteps, texts.loadingSteps]);

  // Экран подбора: строки сменяют друг друга, после последней открывается финал
  useEffect(() => {
    if (!analyzing) return;

    const timers = loadingSteps
      .map((_, index) =>
        index === 0
          ? null
          : setTimeout(() => setAnalyzingIndex(index), ANALYZE_STEP_MS * index)
      )
      .filter(Boolean) as ReturnType<typeof setTimeout>[];

    timers.push(
      setTimeout(() => {
        setAnalyzing(false);
        setStep(LAST_STEP);
      }, ANALYZE_STEP_MS * loadingSteps.length)
    );

    return () => timers.forEach(clearTimeout);
  }, [analyzing, loadingSteps, LAST_STEP]);

  const handleNext = async (
    validateForm: () => Promise<Record<string, any>>
  ) => {
    const errors = await validateForm();

    if (Object.keys(errors).length === 0) {
      if (step === totalQuestions) {
        setAnalyzingIndex(0);
        setAnalyzing(true);
        return;
      }

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

    // Ответы уходят письмом, только если это включено в админке: квиз можно
    // использовать как прогрев, а заявки принимать в мессенджере
    if (sendsEmail) {
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
    }

    // На /success больше не уводим: переход забирает вкладку себе, и ссылка
    // кнопки не успевает открыться — компонент размонтируется раньше, чем
    // браузер обработает её по умолчанию. Человек уходит в мессенджер
    trackLead("quiz", lang, studyCountry);
  };

  const progressPercentage = totalQuestions
    ? (Math.min(step - 1, totalQuestions) / totalQuestions) * 100
    : 0;

  const currentQuestion = step <= totalQuestions ? questions[step - 1] : null;
  const currentFieldName = currentQuestion ? `q_${currentQuestion._key}` : "";

  const questionImageUrl = currentQuestion?.image
    ? urlFor(currentQuestion.image).width(1200).url()
    : "";

  const sendsEmail = quizBlock?.sendAnswersByEmail !== false;

  // Страну для текста финального экрана берём из ответа квиза: он точнее
  // страницы — человек может читать про Венгрию, а хотеть Польшу. Ответ при
  // этом остаётся в браузере и никуда не отправляется
  const countryQuestionKey = questions.find(
    question => question.optionsSource === "countries"
  )?._key;

  const fillCountry = (text: string | undefined, values: DynamicFormValues) => {
    if (!text) return "";

    const answer = countryQuestionKey ? values[`q_${countryQuestionKey}`] : "";
    const code =
      (answer ? studyCountryCodeByName(answer) : undefined) || pageCountryCode;

    const nominative = studyCountryName(code, lang) || texts.country;
    const inflected = studyCountryNameIn(code, lang) || texts.countryIn;

    return text
      .replace(/\{countryIn\}/g, inflected)
      .replace(/\{country\}/g, nominative);
  };

  const isFinalStep = step === LAST_STEP;
  const showQuestion = Boolean(currentQuestion) && !analyzing;
  const showCard = analyzing || isFinalStep;

  return (
    <div
      ref={blockRef}
      className={styles.multiStepForm}
      // по этой метке родительские блоки убирают свой фон и паддинги:
      // на экране подбора и на финальном карточка сама себе фон
      data-quiz-card={showCard ? "true" : undefined}
    >
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchemaByStep[step - 1]}
        onSubmit={async () => {}}
      >
        {({ values, validateForm }) => (
          <Form className={styles.customForm}>
            {showQuestion && (
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

            {showQuestion && currentQuestion && (
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

            {analyzing && (
              <div className={styles.questionWrapper}>
                <div
                  className={`${styles.finalCard} ${styles.analyzingCard}`}
                  role="status"
                  aria-live="polite"
                >
                  <div className={styles.analyzingRing} aria-hidden="true" />

                  <p className={styles.analyzingTitle}>
                    {quizBlock?.loadingTitle || texts.loadingTitle}
                  </p>

                  <ul className={styles.analyzingSteps}>
                    {loadingSteps.map((line, index) => (
                      <li
                        key={line}
                        className={
                          index < analyzingIndex
                            ? styles.analyzingDone
                            : index === analyzingIndex
                              ? styles.analyzingCurrent
                              : styles.analyzingPending
                        }
                      >
                        <span
                          className={styles.analyzingMark}
                          aria-hidden="true"
                        />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {isFinalStep && (
              <div className={styles.questionWrapper}>
                <MessengerCta
                  lang={lang}
                  content={{
                    eyebrow: quizBlock?.finalEyebrow || texts.eyebrow,
                    title: quizBlock?.finalTitle || texts.title,
                    description:
                      quizBlock?.finalDescription || texts.description,
                    mode: quizBlock?.finalMode,
                    telegramLabel: quizBlock?.telegramLabel,
                    telegramLink: quizBlock?.telegramLink,
                    whatsappLabel: quizBlock?.whatsappLabel,
                    whatsappLink: quizBlock?.whatsappLink,
                    note: quizBlock?.finalNote || texts.note,
                    showSocials: quizBlock?.showSocials
                  }}
                  socials={socials}
                  fallbackMessengers={messengers}
                  transformText={text => fillCountry(text, values)}
                  onChannelClick={channel => sendLead(values, channel)}
                  showPolicy={sendsEmail}
                />
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MultiStepFormBlock;
