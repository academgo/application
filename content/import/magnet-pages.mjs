/**
 * Посадочные страницы лид-магнитов: три материала в двух языковых версиях.
 *
 *   node content/import/magnet-pages.mjs            # сухой прогон
 *   node content/import/magnet-pages.mjs --apply    # загрузка черновиков
 *
 * Тексты страниц — не пересказ PDF, а полезная выжимка: страница должна
 * работать и без скачивания. Заголовки подобраны по частотности
 * (DataForSEO, 24.09.2026): «мотивационное письмо» — 680 запросов в месяц
 * по KZ и UZ, «motivation letter template» — 27 100 в мире.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { markdownToPortableText } from "./markdown-to-portable-text.mjs";
import { leadMagnetBlock } from "./lead-magnets.mjs";
import { quizRef, SURVEY_TITLE } from "./quiz.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const PROJECT_ID = "19hn716s";
const DATASET = "production";
const API_VERSION = "2023-05-03";

const APPLY = process.argv.includes("--apply");

const key = () => crypto.randomBytes(6).toString("hex");

const token = () => {
  const envPath = path.join(ROOT, ".env.local");
  const names = ["SANITY_API_WRITE_TOKEN", "SANITY_API_TOKEN"];

  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
    for (const name of names) {
      const line = lines.find(item => item.startsWith(`${name}=`));
      if (line) return line.split("=").slice(1).join("=").trim();
    }
  }

  return names.map(name => process.env[name]).find(Boolean);
};

const text = (markdown, marginBottom = "small") => ({
  _type: "textContent",
  _key: key(),
  marginBottom,
  content: markdownToPortableText(markdown)
});

const faq = (title, items) => ({
  _type: "accordionBlock",
  _key: key(),
  title,
  items: items.map(item => ({
    _key: key(),
    question: item.question,
    answer: markdownToPortableText(item.answer)
  }))
});

const survey = lang => ({
  _type: "surveyBlock",
  _key: key(),
  survey: {
    _type: "object",
    title: SURVEY_TITLE[lang],
    quizDocument: quizRef(lang)
  }
});

// -------------------------------------------------------------------- тексты

const PAGES = {
  motivation: {
    ru: {
      slug: "motivacionnoe-pismo",
      shortTitle: "Мотивационное письмо",
      title: "Мотивационное письмо для поступления: структура и шаблон",
      metaTitle: "Мотивационное письмо для поступления: шаблон и примеры",
      metaDescription:
        "Как написать мотивационное письмо в зарубежный вуз: структура на пять абзацев, примеры формулировок на английском и семь ошибок. Готовый шаблон — скачать бесплатно.",
      coverText:
        "Где письмо действительно спрашивают, что писать в каждом абзаце и из-за чего его не читают дальше первой строки.",
      intro: `Мотивационное письмо читают там, где решение принимает человек, а не калькулятор баллов. На бакалавриат частного вуза по аттестату оно чаще всего не нужно. А вот на магистратуру, на MBA и в стипендиальные программы — почти всегда: вместе с CV и одной-двумя рекомендациями.

На конкурсных стипендиях письмо весит особенно много. На одну из турецких программ подают около 1 500 заявок на 83 места, и отбор идёт в том числе по эссе.`,
      structureTitle: "## Структура: пять абзацев",
      structure: `1. **Кто вы и на какую программу подаёте.** Без предисловий: степень, вуз, год выпуска, средний балл.
2. **Почему именно эта программа.** Два-три конкретных предмета, лаборатория или особенность учебного плана. Этот абзац показывает, что вы читали программу, а не рассылаете одно письмо веером.
3. **Что у вас за плечами.** Учёба, работа, проекты. Каждый пример с результатом: что сделали, что получилось, какие цифры.
4. **Зачем вам эта страна и что дальше.** План на три-пять лет: вузу важно понимать, куда вы идёте после выпуска.
5. **Короткое закрытие.** Одно-два предложения, без «надеюсь на положительное решение».`,
      rulesTitle: "## Объём, язык и оформление",
      rules: `Пишите на языке программы — почти всегда это английский. Одна страница, 400–600 слов. Если вуз задал лимит, лимит важнее любых советов.

Не переводите русское письмо дословно: обороты вроде «хотел бы выразить огромное желание» в английском читаются как пустые. Короткие прямые предложения работают лучше.

Файл называйте понятно: Surname_Name_Motivation_Letter.pdf`,
      mistakesTitle: "## Ошибки, из-за которых письмо не работает",
      mistakes: `- **Одно письмо на все вузы.** Отбор видит это сразу: в тексте нет ни названия программы, ни предметов.
- **Пересказ резюме.** Письмо объясняет выбор, а не дублирует CV.
- **Комплименты вузу.** «Ваш университет известен во всём мире» не добавляет ни балла.
- **Обещания вместо фактов.** «Быстро выучу язык» слабее, чем «сдал IELTS 6.5 в мае».
- **Преувеличения.** Стаж и достижения проверяются по документам, расхождение — повод для отказа.
- **Ошибка в названии программы.** Частая и дорогая опечатка.`,
      faqTitle: "Частые вопросы о мотивационном письме",
      faq: [
        {
          question: "На каком языке писать мотивационное письмо?",
          answer:
            "На языке программы. Если программа на английском — письмо на английском, даже когда вуз находится в Турции, Италии или Венгрии. Перевод русского текста дословно обычно читается тяжело: лучше сразу писать короткими прямыми предложениями."
        },
        {
          question: "Какой объём у мотивационного письма?",
          answer:
            "Одна страница, 400–600 слов, четыре-пять абзацев. Если вуз или стипендиальная программа задали свой лимит — например, эссе до 500 слов или до двух страниц, — соблюдайте его: превышение лимита само по себе повод отложить заявку."
        },
        {
          question: "Нужно ли письмо для поступления на бакалавриат?",
          answer:
            "Чаще всего нет: в частные вузы Турции, Северного Кипра и Малайзии зачисляют по аттестату. Письмо понадобится на конкурсных программах, в стипендиальных конкурсах и почти всегда на магистратуре и MBA."
        }
      ],
      cta: `Пришлите черновик письма и ссылку на программу — разберём по абзацам и скажем, что убрать, что добавить и где формулировка работает против вас. Первая консультация бесплатная. Офис AcademGo: Варшава, ul. Złota 7/28.`
    },
    en: {
      slug: "motivation-letter-template",
      shortTitle: "Motivation letter",
      title: "Motivation letter for university: structure and template",
      metaTitle: "Motivation Letter Template for University Applications",
      metaDescription:
        "How to write a motivation letter for a university abroad: a five-paragraph structure, example wording and seven mistakes to avoid. Download the template for free.",
      coverText:
        "Where a letter is really required, what each paragraph has to do, and what makes admissions stop reading after the first line.",
      intro: `A motivation letter matters where a person decides, not a score calculator. For a bachelor's place at a private university, admitted on school grades, you usually do not need one. For a master's, an MBA or a scholarship you almost always do — together with a CV and one or two references.

On competitive scholarships the letter carries real weight. One Turkish programme receives about 1,500 applications for 83 places, and the essay is part of how they choose.`,
      structureTitle: "## The structure: five paragraphs",
      structure: `1. **Who you are and what you are applying for.** No run-up: degree, university, year, GPA.
2. **Why this programme.** Two or three specific courses, a lab or a feature of the curriculum. This paragraph proves you read the programme page instead of mailing one letter to twenty universities.
3. **What you have behind you.** Studies, work, projects. Every example ends in a result: what you did, what came of it, the numbers.
4. **Why this country and what comes next.** A three-to-five-year plan: admissions care that you know where you are going after graduation.
5. **A short close.** One or two sentences, without "I hope for a positive decision".`,
      rulesTitle: "## Length, language and format",
      rules: `Write in the language of the programme — nearly always English. One page, 400–600 words. If the university sets a limit, the limit beats any advice here.

Name the file clearly: Surname_Name_Motivation_Letter.pdf`,
      mistakesTitle: "## Mistakes that make a letter useless",
      mistakes: `- **One letter for every university.** Admissions spot it instantly: no programme name, no course names.
- **Retelling your CV.** The letter explains the choice; it does not duplicate the résumé.
- **Compliments to the university.** "Your university is world-renowned" adds nothing.
- **Promises instead of facts.** "I will learn the language quickly" is weaker than "I scored IELTS 6.5 in May".
- **Exaggeration.** Experience is checked against documents; a mismatch is grounds for rejection.
- **The wrong programme name.** A common and expensive typo.`,
      faqTitle: "Motivation letter: common questions",
      faq: [
        {
          question: "What language should the motivation letter be in?",
          answer:
            "The language of the programme. If the programme is taught in English, the letter is in English — even when the university is in Türkiye, Italy or Hungary."
        },
        {
          question: "How long should a motivation letter be?",
          answer:
            "One page, 400–600 words, four or five paragraphs. If the university or the scholarship sets its own limit — an essay of up to 500 words, or two pages — keep to it: going over the limit is reason enough to set an application aside."
        },
        {
          question: "Do I need a letter for a bachelor's application?",
          answer:
            "Usually not: private universities in Türkiye, North Cyprus and Malaysia admit on school grades. You will need one for competitive programmes, for scholarships, and almost always for master's and MBA applications."
        }
      ],
      cta: `Send us your draft and the programme link — we will go through it paragraph by paragraph and tell you what to cut, what to add and where the wording works against you. The first consultation is free. AcademGo office: Warsaw, ul. Złota 7/28.`
    }
  },
  ielts: {
    ru: {
      slug: "ielts-dlya-postupleniya",
      shortTitle: "IELTS для поступления",
      title: "IELTS для поступления: какой балл нужен",
      metaTitle: "IELTS для поступления: какой балл нужен в вузах 10 стран",
      metaDescription:
        "Пороги IELTS в вузах Турции, ОАЭ, Малайзии, Италии, Венгрии и Кипра, альтернативы сертификату и случаи, когда экзамен вообще не нужен. Таблица — скачать бесплатно.",
      coverText:
        "Проверенные пороги по 20 вузам, альтернативы сертификату и вузы, где вместо IELTS сдают внутренний экзамен.",
      intro: `Половина вопросов про язык снимается одной цифрой: какой балл требует ваша программа. Вторая половина — тем, что во многих вузах сертификат можно не сдавать вовсе.

Для поступления почти всегда нужен модуль Academic, а не General Training. Часть вузов принимает оба — например, Politecnico di Milano и NABA в Италии. Сертификат действует два года; это же правило у TOEFL и PTE, а кембриджские сертификаты бессрочные.`,
      structureTitle: "## Ориентиры по баллам",
      structure: `- **5.0–5.5** — порог большинства программ бакалавриата в Малайзии, на Северном Кипре и в части итальянских вузов.
- **6.0** — типичный порог филиалов британских вузов в Дубае и медицинских программ Малайзии и Северного Кипра.
- **6.5** — Istanbul Medipol, Bocconi, McDaniel, магистратура на Южном Кипре.
- **Отдельный случай** — METU в Турции: этот вуз не принимает IELTS с декабря 2022 года, нужен TOEFL iBT или PTE.

Общий балл — не всё: Bocconi требует 6.5 при минимуме 6.0 в каждой части, Middlesex в Дубае — 6.0 при минимуме 5.5.`,
      rulesTitle: "## Когда сертификат не нужен",
      rules: `- **Внутренний экзамен вуза.** CIU и NEU на Северном Кипре проводят собственный тест.
- **Онлайн-интервью.** Budapest Metropolitan в Венгрии зачисляет без сертификата.
- **Школа или диплом на английском.** Многие вузы освобождают выпускников англоязычных программ; в Малайзии засчитывают школьный английский и экзамен MUET.
- **Языковой год.** Если балла не хватает, вузы Турции, Северного Кипра и Малайзии берут на подготовительный год английского.`,
      mistakesTitle: "## Ошибки, из-за которых экзамен пересдают",
      mistakes: `- Сдали General вместо Academic.
- Добрали общий балл, но не прошли по минимуму в отдельной части.
- Сдали онлайн там, где принимают только очный формат: Medipol не засчитывает ни IELTS Online, ни TOEFL Home Edition.
- Сертификат истёк: два года считаются к дате подачи документов, а не к началу учёбы.
- Сдали слишком поздно — вузу нужно время на проверку, закладывайте месяц до дедлайна.`,
      faqTitle: "Частые вопросы про IELTS",
      faq: [
        {
          question: "Какой балл IELTS нужен для поступления за границу?",
          answer:
            "Зависит от программы: 5.0–5.5 на бакалавриате в Малайзии и на Северном Кипре, 6.0 в филиалах британских вузов в Дубае, 6.5 в Istanbul Medipol и Bocconi. На медицине пороги выше, чем на общих направлениях."
        },
        {
          question: "Можно ли поступить без IELTS?",
          answer:
            "Да, и чаще, чем принято думать. Часть вузов проводит собственный экзамен по английскому, Budapest Metropolitan зачисляет по онлайн-интервью, выпускников англоязычных школ обычно освобождают, а при нехватке балла берут на подготовительный языковой год."
        },
        {
          question: "Сколько действует сертификат IELTS?",
          answer:
            "Два года. Срок считается к дате подачи документов в вуз, а не к началу занятий, поэтому сдавать экзамен «впрок» за год до подачи рискованно."
        }
      ],
      cta: `Пришлите список программ — проверим требования по каждой, посчитаем срок подготовки и скажем, где сертификат можно не сдавать. Первая консультация бесплатная. Офис AcademGo: Варшава, ul. Złota 7/28.`
    },
    en: {
      slug: "ielts-score-for-university",
      shortTitle: "IELTS score",
      title: "IELTS score for university admission",
      metaTitle: "IELTS Score for University Admission: Thresholds by Country",
      metaDescription:
        "IELTS thresholds at universities in Türkiye, the UAE, Malaysia, Italy, Hungary and Cyprus, accepted alternatives and where no certificate is needed. Free table to download.",
      coverText:
        "Checked thresholds at 20 universities, accepted alternatives, and the universities that run their own English exam instead.",
      intro: `Half the language question is answered by one number: the score your programme asks for. The other half is that many universities let you skip the certificate altogether.

Admission almost always means the Academic module, not General Training. Some universities accept both — Politecnico di Milano and NABA in Italy, for instance. The certificate is valid for two years; the same applies to TOEFL and PTE, while Cambridge certificates do not expire.`,
      structureTitle: "## What the thresholds look like",
      structure: `- **5.0–5.5** — most bachelor's programmes in Malaysia, North Cyprus and several Italian universities.
- **6.0** — the usual bar at UK branch campuses in Dubai and on medical programmes in Malaysia and North Cyprus.
- **6.5** — Istanbul Medipol, Bocconi, McDaniel, master's programmes in Cyprus.
- **A special case** — METU in Türkiye has not accepted IELTS since December 2022; you need TOEFL iBT or PTE.

The overall band is not everything: Bocconi asks 6.5 with at least 6.0 in every part, Middlesex Dubai 6.0 with at least 5.5.`,
      rulesTitle: "## When you do not need the certificate",
      rules: `- **The university's own exam.** CIU and NEU in North Cyprus run their own English test.
- **An online interview.** Budapest Metropolitan in Hungary admits without a certificate.
- **School or a degree in English.** Many universities exempt graduates of English-medium programmes; Malaysia also counts school English and the MUET exam.
- **A preparatory language year.** If your score falls short, universities in Türkiye, North Cyprus and Malaysia enrol you on an English foundation year.`,
      mistakesTitle: "## Mistakes that force a retake",
      mistakes: `- Sitting General instead of Academic.
- Hitting the overall band but missing the minimum in one part.
- Sitting online where only a test centre counts: Medipol accepts neither IELTS Online nor TOEFL Home Edition.
- Letting the certificate expire: the two years run to the application date, not to the start of the programme.
- Sitting too late — the university needs time to verify results, so leave a month before the deadline.`,
      faqTitle: "IELTS: common questions",
      faq: [
        {
          question: "What IELTS score do I need to study abroad?",
          answer:
            "It depends on the programme: 5.0–5.5 for bachelor's places in Malaysia and North Cyprus, 6.0 at UK branch campuses in Dubai, 6.5 at Istanbul Medipol and Bocconi. Medical programmes ask for more than general ones."
        },
        {
          question: "Can I get in without IELTS?",
          answer:
            "Yes, more often than people expect. Some universities run their own English exam, Budapest Metropolitan admits on an online interview, graduates of English-medium schools are usually exempt, and a low score can be handled by a preparatory language year."
        },
        {
          question: "How long is an IELTS certificate valid?",
          answer:
            "Two years, counted to the date you apply rather than the date the programme starts — so sitting the exam a year ahead of the application is a risk."
        }
      ],
      cta: `Send us your shortlist — we will check the requirement for each programme, work out how long you need to prepare and tell you where no certificate is needed. The first consultation is free. AcademGo office: Warsaw, ul. Złota 7/28.`
    }
  },
  documents: {
    ru: {
      slug: "dokumenty-dlya-postupleniya-za-granicu",
      shortTitle: "Документы и апостиль",
      title: "Документы для поступления за границу: апостиль и признание аттестата",
      metaTitle: "Документы для поступления за границу: апостиль и нострификация",
      metaDescription:
        "Какие документы нужны для поступления в зарубежный вуз: апостиль или консульская легализация, признание аттестата по странам, сроки и порядок шагов. Чек-лист — скачать бесплатно.",
      coverText:
        "Где хватит апостиля, где нужна консульская легализация и какое отдельное признание аттестата требует каждая страна.",
      intro: `Самая частая причина сорванного поступления — не баллы и не деньги, а документы, которые начали готовить поздно. Апостиль, перевод и признание аттестата занимают от двух недель до трёх месяцев, а в некоторых странах их нельзя сделать после приезда.

Одно правило важнее остальных: перевод делается с уже легализованного документа. Поменяете порядок — платить придётся дважды.`,
      structureTitle: "## Базовый пакет",
      structure: `- Загранпаспорт со сроком действия с запасом на весь период обучения.
- Аттестат за 11 классов и приложение с оценками; для магистратуры — диплом и транскрипт.
- Заверенный перевод на язык страны или на английский.
- Сертификат по английскому, если он требуется программой.
- Фотографии по требованиям страны, медицинская страховка, подтверждение средств.`,
      rulesTitle: "## Апостиль или консульская легализация",
      rules: `Страны СНГ участвуют в Гаагской конвенции, поэтому для большинства направлений достаточно апостиля. Но не для всех.

- **Турция** — апостиль дома, нотариальный перевод на турецкий, затем Denklik в Министерстве образования.
- **ОАЭ** — апостиль **не принимают**: нужна консульская легализация через нотариуса, МИД вашей страны, посольство ОАЭ и MoFA, плюс отдельная эквивалентность в MoE.
- **Испания** — апостиль, присяжный перевод и омологация аттестата.
- **Италия** — апостиль, перевод, признание через CIMEA или Dichiarazione di valore и предзачисление на Universitaly.
- **Грузия** — апостиль, перевод и признание в NCEQE.
- **Малайзия** — страна не участвует в конвенции, апостиль сам по себе ничего не даёт: ориентируйтесь на требования вуза и EMGS.
- **Северный Кипр** — апостиль ставят дома: в самой ТРСК его поставить нельзя.`,
      mistakesTitle: "## Три ошибки, которые стоят года",
      mistakes: `- **Перевод раньше легализации.** Переводить нужно уже легализованный документ.
- **Отъезд без апостиля.** В ряде стран его ставят только лично или по доверенности — из-за границы это дольше и дороже.
- **Оплата депозита до проверки признания.** Депозит почти всегда невозвратный.`,
      faqTitle: "Частые вопросы о документах",
      faq: [
        {
          question: "Нужен ли апостиль на аттестат?",
          answer:
            "Для большинства направлений да: страны СНГ участвуют в Гаагской конвенции, и апостиля достаточно. Исключения — ОАЭ, где апостиль не принимают и нужна консульская легализация через четыре инстанции, и Малайзия, которая в конвенции не участвует."
        },
        {
          question: "Что такое признание аттестата и чем оно отличается от апостиля?",
          answer:
            "Апостиль подтверждает подлинность документа, а признание — что ваше школьное образование соответствует местному. Это отдельные процедуры: Denklik в Турции, омологация в Испании, CIMEA или DOV в Италии, NCEQE в Грузии, нострификация в Польше."
        },
        {
          question: "За сколько начинать готовить документы?",
          answer:
            "За четыре-шесть месяцев до начала семестра, а легализацию запускать одновременно с подачей заявки в вуз, не дожидаясь ответа. Признание аттестата занимает от двух недель до нескольких месяцев, виза — около месяца плюс очередь на запись."
        }
      ],
      cta: `Пришлите аттестат и список стран, которые рассматриваете, — скажем, что нужно именно вам, в каком порядке и в какие сроки. Первая консультация бесплатная. Офис AcademGo: Варшава, ul. Złota 7/28.`
    },
    en: {
      slug: "documents-to-study-abroad",
      shortTitle: "Documents and apostille",
      title: "Documents to study abroad: apostille and certificate recognition",
      metaTitle: "Documents to Study Abroad: Apostille and Legalisation Checklist",
      metaDescription:
        "What documents you need to apply to a university abroad: apostille or consular legalisation, certificate recognition by country, timings and the order of steps. Free checklist.",
      coverText:
        "Where an apostille is enough, where consular legalisation is required and what separate recognition step each destination asks for.",
      intro: `Most failed applications are lost on paperwork, not on grades or money. Apostille, translation and recognition take anywhere from two weeks to three months — and in some countries they cannot be done after you arrive.

One rule matters more than the rest: the translation is made from the legalised document. Change the order and you pay twice.`,
      structureTitle: "## The basic pack",
      structure: `- A passport valid well beyond the end of your programme.
- School certificate and transcript; for a master's — degree and transcript.
- Certified translation into the local language or into English.
- An English test certificate, if the programme requires one.
- Photos to local specification, health insurance, proof of funds.`,
      rulesTitle: "## Apostille or consular legalisation",
      rules: `- **Türkiye** — apostille at home, notarised translation into Turkish, then Denklik at the Ministry of Education.
- **UAE** — an apostille is **not accepted**: you need consular legalisation through a notary, your country's MFA, the UAE embassy and MoFA, plus separate equivalency at the MoE.
- **Spain** — apostille, sworn translation and homologación.
- **Italy** — apostille, translation, recognition via CIMEA or Dichiarazione di valore, and pre-enrolment on Universitaly.
- **Georgia** — apostille, translation and recognition at NCEQE.
- **Malaysia** — not a party to the Hague Convention, so an apostille alone does nothing: follow the university and EMGS requirements.
- **North Cyprus** — get the apostille at home: it cannot be issued inside the TRNC.`,
      mistakesTitle: "## Three mistakes that cost a year",
      mistakes: `- **Translating before legalising.** The translation must be made from the legalised document.
- **Leaving home without an apostille.** In several countries it can only be obtained in person or by proxy.
- **Paying the deposit before checking recognition.** Deposits are almost always non-refundable.`,
      faqTitle: "Documents: common questions",
      faq: [
        {
          question: "Do I need an apostille on my school certificate?",
          answer:
            "For most destinations, yes. The exceptions are the UAE, which does not accept apostilles and requires four-step consular legalisation, and Malaysia, which is not a party to the Hague Convention."
        },
        {
          question: "How is recognition different from an apostille?",
          answer:
            "An apostille confirms the document is genuine; recognition confirms your schooling matches the local system. They are separate procedures: Denklik in Türkiye, homologación in Spain, CIMEA or DOV in Italy, NCEQE in Georgia, nostrification in Poland."
        },
        {
          question: "How early should I start on documents?",
          answer:
            "Four to six months before the semester starts, and begin legalisation together with your application rather than after the offer. Recognition takes two weeks to several months; the visa needs about a month plus the appointment queue."
        }
      ],
      cta: `Send us your school certificate and the countries you are considering — we will tell you what is needed, in what order and by when. The first consultation is free. AcademGo office: Warsaw, ul. Złota 7/28.`
    }
  }
};

// ------------------------------------------------------------- сбор страниц

const buildPage = (magnet, lang) => {
  const content = PAGES[magnet][lang];
  const id = `academgo.magnet.${magnet}.${lang}`;

  return {
    _id: `drafts.${id}`,
    _type: "singlepage",
    title: content.title,
    shortTitle: content.shortTitle,
    slug: {
      _type: "localizedSlug",
      [lang]: { _type: "slug", current: content.slug }
    },
    seo: {
      metaTitle: content.metaTitle,
      metaDescription: content.metaDescription
    },
    coverBlock: {
      coverTitle: content.title,
      coverText: content.coverText
    },
    pageType: "other",
    language: lang,
    publishedAt: new Date().toISOString(),
    contentBlocks: [
      text(content.intro),
      text(`${content.structureTitle}\n\n${content.structure}`),
      text(`${content.rulesTitle}\n\n${content.rules}`),
      leadMagnetBlock(magnet, lang),
      text(`${content.mistakesTitle}\n\n${content.mistakes}`),
      faq(content.faqTitle, content.faq),
      survey(lang),
      text(content.cta, "large")
    ].filter(Boolean)
  };
};

const documents = [];

for (const magnet of Object.keys(PAGES)) {
  for (const lang of ["ru", "en"]) {
    documents.push(buildPage(magnet, lang));
  }

  documents.push({
    _id: `academgo.tm.magnet.${magnet}`,
    _type: "translation.metadata",
    schemaTypes: ["singlepage"],
    translations: ["ru", "en"].map(lang => ({
      _key: lang,
      _type: "internationalizedArrayReferenceValue",
      value: {
        _type: "reference",
        _ref: `academgo.magnet.${magnet}.${lang}`,
        _weak: true
      }
    }))
  });
}

// ------------------------------------------------------------------- запуск

const main = async () => {
  if (!token()) {
    console.error("Нет токена: добавьте SANITY_API_TOKEN в .env.local");
    process.exit(1);
  }

  documents
    .filter(document => document._type === "singlepage")
    .forEach(document => {
      const magnet = document.contentBlocks.find(
        block => block._type === "leadMagnetBlock"
      );

      console.log(
        `${document.language}  /${
          document.slug[document.language].current
        }  блоков: ${document.contentBlocks.length}, файл: ${
          magnet?.file?.asset?._ref ? "есть" : "НЕТ"
        }`
      );
    });

  if (!APPLY) {
    console.log("\nСухой прогон. Для загрузки добавьте --apply");
    return;
  }

  const response = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token()}`
      },
      body: JSON.stringify({
        mutations: documents.map(document => ({ createOrReplace: document }))
      })
    }
  );

  const result = await response.json();

  if (!response.ok) {
    console.error("Ошибка:", JSON.stringify(result, null, 2));
    process.exit(1);
  }

  console.log("\nГотово.");
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
