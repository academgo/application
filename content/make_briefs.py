"""Генератор брифов для страны: python content/make_briefs.py <country>
Конфигурация стран — в COUNTRIES ниже. Создаёт content/drafts/<country>/<page>/brief.md и _plan.md.
Существующие brief.md не перезаписывает."""
import os, sys, json

ROOT = os.path.dirname(os.path.abspath(__file__))

COUNTRIES = {
 "uae": {
  "name_ru": "ОАЭ", "name_en": "the UAE", "hub_ru": "/ru/ucheba-v-oae", "hub_en": "/study-in-uae",
  "facts": "uae.md",
  "kw_note": "RU — Google Ads KZ / UZ / KG / AZ; EN — мир / PK / IN / NG (DataForSEO 21.09.2026, content/keywords/uae-*.json). Спрос — прежде всего бренды кампусов; основная EN-аудитория по объёму — Индия.",
  "audience_ru": "абитуриенты и родители из Казахстана, Узбекистана, Кыргызстана, Азербайджана, России, Беларуси; часть семей уже живёт в ОАЭ",
  "audience_en": "applicants and parents from India (largest demand), Pakistan, Nigeria, Egypt, and expat families living in the UAE/GCC",
  "honesty_ru": "Честно про: разницу лицензии KHDA и федеральной аккредитации CAA/MoHESR и что это значит для признания диплома; реальную стоимость (обучение + жильё); ограничения работы студентов; тему безопасности — только нейтрально по официальным источникам из сводки.",
  "honesty_en": "Be honest about: KHDA licensing vs federal CAA/MoHESR accreditation and what it means for degree recognition; real total cost (tuition + housing); student work limits; safety — only neutrally, from official sources in the fact sheet.",
  "hub": {"ru_kw": "учеба в дубае / учеба в оаэ (по 10 в KZ/UZ/KG/AZ); университеты дубая / университеты оаэ (KZ 30)", "en_kw": "universities in dubai (9 900 / PK 480 / IN 2 400); study in dubai (1 900 / IN 1 000); universities in uae (4 400); study in uae (720)"},
  "topics": [
   {"key": "universities", "ru_slug": "universitety-dubaya", "en_slug": "universities-in-dubai",
    "ru_title": "Университеты Дубая и ОАЭ для иностранцев", "en_title": "Universities in Dubai for international students",
    "ru_kw": "университеты дубая, лучшие университеты дубая, британский университет в дубае, университеты оаэ (KZ 10–30)", "en_kw": "universities in dubai (9 900); best universities in dubai (4 400 / IN 1 900); khda (22 200); american university in dubai (14 800)",
    "focus": "список и сравнение кампусов (страна вуза-родителя, аккредитация KHDA/CAA, цены, программы), как выбрать, что значит KHDA vs CAA; таблица вузов только из сводок"},
   {"key": "masters-mba", "ru_slug": "magistratura-i-mba-v-dubae", "en_slug": "masters-and-mba-in-dubai",
    "ru_title": "Магистратура и MBA в Дубае", "en_title": "Master's and MBA in Dubai",
    "ru_kw": "магистратура в оаэ, mba в дубае (по 10)", "en_kw": "mba in dubai (3 600 / IN 1 900); masters in dubai (2 400 / IN 880)",
    "focus": "программы магистратуры и MBA в кампусах, стоимость, требования (диплом, опыт, английский), форматы (очно/part-time), визовые и карьерные аспекты"},
   {"key": "visa", "ru_slug": "studencheskaya-viza-v-oae", "en_slug": "uae-student-visa",
    "ru_title": "Студенческая виза в ОАЭ", "en_title": "UAE student visa",
    "ru_kw": "студенческая виза в дубай, студенческая виза оаэ (по 10–30)", "en_kw": "dubai student visa (1 600 / IN 880); uae student visa (720)",
    "focus": "спонсорство вуза, шаги, документы, медосмотр, Emirates ID, стоимость, срок, продление, работа во время учёбы, визы после выпуска и Golden Visa (строго по сводке)"},
   {"key": "cost", "ru_slug": "stoimost-obucheniya-v-dubae", "en_slug": "cost-of-studying-in-dubai",
    "ru_title": "Стоимость обучения и жизни в Дубае, стипендии", "en_title": "Cost of studying in Dubai and scholarships",
    "ru_kw": "стоимость обучения в дубае (10–30); обучение в дубае для казахстанцев", "en_kw": "cost of studying in dubai (70); scholarships in uae for international students (880); part time jobs in dubai for students (880)",
    "focus": "стоимость обучения по уровням и вузам, жильё и жизнь, стипендии вузов, можно ли подрабатывать, пример бюджета на год"},
  ],
  "cards": [
   ("middlesex", "middlesex-university-dubai", "Middlesex University Dubai", "uae-middlesex.md", "middlesex university dubai — KZ 320 / UZ 140 / AZ 170", "middlesex university dubai — 49 500 / IN 18 100 / PK 1 900 / NG 590"),
   ("uowd", "university-of-wollongong-in-dubai", "University of Wollongong in Dubai (UOWD)", "uae-uowd.md", "university of wollongong dubai — KZ 390 / AZ 210 / UZ 170", "university of wollongong in dubai — 60 500 / IN 9 900 / PK 1 600"),
   ("heriot-watt", "heriot-watt-university-dubai", "Heriot-Watt University Dubai", "uae-heriot-watt.md", "heriot watt dubai — KZ 70 / AZ 30", "heriot watt university dubai — 33 100 / IN 9 900 / PK 720"),
   ("birmingham", "university-of-birmingham-dubai", "University of Birmingham Dubai", "uae-birmingham.md", "university of birmingham dubai — KZ 170 / UZ 170 / AZ 110", "university of birmingham dubai — 40 500 / IN 8 100 / PK 590"),
   ("curtin", "curtin-university-dubai", "Curtin University Dubai", "uae-curtin.md", "curtin university dubai — KZ 30 / UZ 30", "curtin university dubai — 18 100 / IN 2 400 / PK 720"),
  ],
 },
 "malaysia": {
  "name_ru": "Малайзии", "name_en": "Malaysia", "hub_ru": "/ru/ucheba-v-malayzii", "hub_en": "/study-in-malaysia",
  "facts": "malaysia.md",
  "kw_note": "RU — Google Ads KZ / UZ / KG / AZ; EN — мир / PK / IN / NG (DataForSEO 21.09.2026, content/keywords/malaysia-*.json). Спрос — бренды вузов, EMGS и магистратура; RU-аудитория ищет вузы латиницей.",
  "audience_ru": "абитуриенты и родители из Казахстана, Узбекистана, Кыргызстана, Азербайджана, России, Беларуси",
  "audience_en": "applicants and parents from Pakistan, India, Bangladesh, Nigeria, Egypt, and GCC expat families",
  "honesty_ru": "Честно про: апостиль не работает (Малайзия не в Гаагской конвенции) — как заверяют документы; учебная виза через EMGS нужна всем, включая граждан СНГ; цены для иностранцев отличаются от цен для местных, плюс 6% SST; работа студентов ограничена каникулами; Graduate Pass доступен не всем гражданствам; британский диплом 3+0 не даёт UK Graduate Route.",
  "honesty_en": "Be honest about: Malaysia is not in the Apostille Convention — how documents are certified; everyone needs a Student Pass via EMGS; international fees differ from local ones, plus 6% SST; student work is limited to breaks; the Graduate Pass is not open to all nationalities; a 3+0 UK degree does not give the UK Graduate Route.",
  "hub": {"ru_kw": "учеба в малайзии (KZ 70); обучение в малайзии (KZ 50); университеты малайзии (KZ 110)", "en_kw": "study in malaysia (3 600 / PK 390 / IN 390); universities in malaysia (18 100 / IN 1 600 / PK 880 / NG 260)"},
  "topics": [
   {"key": "universities", "ru_slug": "universitety-malayzii", "en_slug": "universities-in-malaysia",
    "ru_title": "Университеты Малайзии для иностранцев", "en_title": "Universities in Malaysia for international students",
    "ru_kw": "университеты малайзии (KZ 110); малайзия университеты гранты; как поступить в университет малайзии", "en_kw": "universities in malaysia (18 100); best universities in malaysia (12 100 / IN 880); monash university malaysia (74 000); sunway university (110 000)",
    "focus": "государственные, частные и кампусы зарубежных вузов; программы 3+0 и 2+1 с британскими партнёрами — какой диплом получаете; рейтинги (только из сводок); таблица вузов"},
   {"key": "visa", "ru_slug": "studencheskaya-viza-v-malayziyu", "en_slug": "malaysia-student-visa",
    "ru_title": "Студенческая виза в Малайзию и EMGS", "en_title": "Malaysia student visa and EMGS",
    "ru_kw": "студенческая виза в малайзию (10)", "en_kw": "malaysia student visa (2 900 / PK 320 / IN 260); emgs (246 000 — в основном проверка статуса)",
    "focus": "EMGS: шаги, eVAL, VAL, сроки, сборы (строго по сводке), медосмотр, страховка, въезд, продление Student Pass, документы и их заверение без апостиля, работа во время учёбы, Graduate Pass"},
   {"key": "masters", "ru_slug": "magistratura-v-malayzii", "en_slug": "masters-in-malaysia",
    "ru_title": "Магистратура в Малайзии", "en_title": "Master's degree in Malaysia",
    "ru_kw": "магистратура в малайзии (10)", "en_kw": "masters in malaysia (18 100 / IN 2 900)",
    "focus": "форматы (coursework/research/mixed), длительность, стоимость, требования, популярные направления, вузы из сводок"},
   {"key": "cost", "ru_slug": "stoimost-obucheniya-v-malayzii", "en_slug": "cost-of-studying-in-malaysia",
    "ru_title": "Стоимость обучения и жизни в Малайзии, стипендии", "en_title": "Cost of studying in Malaysia and scholarships",
    "ru_kw": "стоимость обучения в малайзии (10)", "en_kw": "scholarships in malaysia for international students (1 300); cost of studying in malaysia (50)",
    "focus": "стоимость foundation / бакалавриата / магистратуры по типам вузов (с SST), жизнь в Куала-Лумпуре, EMGS и страховка как обязательные расходы, стипендии, пример бюджета на год"},
  ],
  "cards": [
   ("taylors", "taylors-university", "Taylor's University", "malaysia-taylors.md", "taylor's university — KZ 590 / UZ 320 / KG 140", "taylors university — 110 000 / IN 2 400 / PK 1 000"),
   ("apu", "asia-pacific-university", "Asia Pacific University (APU)", "malaysia-apu.md", "asia pacific university — KZ 320 / UZ 170; apu malaysia — KZ 260", "asia pacific university — 33 100 / IN 1 900 / PK 1 000"),
   ("ucsi", "ucsi-university", "UCSI University", "malaysia-ucsi.md", "ucsi university — KZ 320 / UZ 210", "ucsi university — 49 500 / IN 1 600 / PK 590"),
   ("um", "universiti-malaya", "Universiti Malaya (UM)", "malaysia-um.md", "universiti malaya — UZ 140 / KZ 110", "universiti malaya — 135 000 / IN 1 600 / PK 720"),
   ("utm", "universiti-teknologi-malaysia", "Universiti Teknologi Malaysia (UTM)", "malaysia-utm.md", "universiti teknologi malaysia — KZ 110 / UZ 110", "universiti teknologi malaysia — 90 500 / IN 1 600 / PK 880"),
  ],
 },
 "italy": {
  "name_ru": "Италии", "name_en": "Italy", "hub_ru": "/ru/ucheba-v-italii", "hub_en": "/study-in-italy",
  "facts": "italy.md",
  "kw_note": "RU — Google Ads KZ / UZ / KG / AZ; EN — мир / PK / IN / NG (DataForSEO 21.09.2026, content/keywords/italy-*.json). Спрос — бренды вузов и портал Universitaly; RU-аудитория ищет вузы латиницей.",
  "audience_ru": "абитуриенты и родители из Казахстана, Узбекистана, Кыргызстана, Азербайджана, России, Беларуси; много интереса к бесплатной учёбе через стипендию DSU",
  "audience_en": "applicants and parents from Pakistan (large demand), India, Nigeria, Bangladesh, Egypt, GCC",
  "honesty_ru": "Честно про: итальянскую бюрократию и сроки (предзачисление на Universitaly, CIMEA/DOV, консульство, permesso di soggiorno); DSU — это конкурс по доходу и заслугам, при потере стипендии возвращают всю полученную сумму; нехватку жилья; реальный финансовый минимум для визы; что частные академии (AFAM) выдают разные типы дипломов — проверять статус программы.",
  "honesty_en": "Be honest about: Italian bureaucracy and timelines (Universitaly pre-enrolment, CIMEA/DOV, consulate, permesso di soggiorno); DSU is income- and merit-based and losing it means repaying everything received; the housing shortage; the real financial minimum for the visa; private academies (AFAM) award different types of diplomas — check programme status.",
  "hub": {"ru_kw": "учеба в италии (KZ 70); обучение в италии (KZ 50); университеты италии (KZ 170, KG 70)", "en_kw": "study in italy (14 800 / PK 1 600 / IN 1 900); universities in italy (27 100 / PK 4 400 / IN 3 600 / NG 720)"},
  "topics": [
   {"key": "dsu", "ru_slug": "stipendiya-dsu", "en_slug": "dsu-scholarship",
    "ru_title": "Стипендия DSU и бесплатная учёба в Италии", "en_title": "DSU scholarship in Italy",
    "ru_kw": "стипендия dsu (KZ 30); учеба в италии бесплатно (10)", "en_kw": "dsu scholarship (8 100 / PK 1 000 / IN 1 600); italy scholarship for international students (2 900)",
    "focus": "кто может получить DSU, пороги ISEE/ISPE (национальные и региональные), суммы, бесплатная столовая и жильё, требования по кредитам, условия потери и возврата, ISEE parificato, сроки подачи, примеры регионов; другие стипендии"},
   {"key": "admission", "ru_slug": "postuplenie-v-italiyu", "en_slug": "admission-universitaly",
    "ru_title": "Поступление в Италию: Universitaly, CIMEA, документы", "en_title": "Admission to Italian universities: Universitaly, CIMEA and documents",
    "ru_kw": "universitaly (KZ 1 000, UZ 880, AZ 590); поступление в италию (KZ 70)", "en_kw": "universitaly (246 000 / PK 18 100 / IN 8 100); study in italy without ielts (90)",
    "focus": "12 лет обучения, CIMEA и DOV, апостиль/легализация по странам, предзачисление на Universitaly, вступительные тесты, английский/итальянский, календарь 2027/28 (без выдуманных дат)"},
   {"key": "medicine", "ru_slug": "medicina-v-italii", "en_slug": "medicine-in-italy",
    "ru_title": "Медицина в Италии на английском и тест IMAT", "en_title": "Studying medicine in Italy: IMAT and English-taught programmes",
    "ru_kw": "imat (KZ 110); медицина в италии (10)", "en_kw": "imat (49 500 / IN 4 400 / PK 720); mbbs in italy (2 400 / IN 1 900); study medicine in italy (320)",
    "focus": "англоязычные программы медицины, тест для них после реформы, квоты для не-ЕС, реформа для итальянских программ, стоимость, признание диплома (только ✅)"},
   {"key": "visa", "ru_slug": "studencheskaya-viza-v-italiyu", "en_slug": "italy-student-visa",
    "ru_title": "Студенческая виза в Италию и permesso di soggiorno", "en_title": "Italy student visa and permesso di soggiorno",
    "ru_kw": "студенческая виза в италию (KZ 30); permesso di soggiorno (KZ 50)", "en_kw": "italy student visa (2 900 / PK 720 / IN 590); permesso di soggiorno (1 220 000 — в основном уже живущие в Италии)",
    "focus": "виза D: документы, финансовый минимум, жильё, страховка; permesso di soggiorno: 8 дней, почтовый набор, сборы, продление; работа 20 ч/нед; после выпуска"},
  ],
  "cards": [
   ("bocconi", "bocconi-university", "Bocconi University", "italy-bocconi.md", "bocconi — KZ 590 / UZ 170 / AZ 170", "bocconi university — 74 000 / IN 8 100 / PK 1 600"),
   ("naba", "naba", "NABA — Nuova Accademia di Belle Arti", "italy-naba.md", "naba — UZ 110 / KZ 90", "naba — 49 500 / IN 3 600 / PK 320"),
   ("marangoni", "istituto-marangoni", "Istituto Marangoni", "italy-marangoni.md", "istituto marangoni — KZ 210 / UZ 90 / AZ 90", "istituto marangoni — 49 500 / IN 4 400"),
   ("polimi", "politecnico-di-milano", "Politecnico di Milano", "italy-polimi.md", "politecnico di milano — KZ 1 000 / AZ 720 / UZ 590; миланский политехнический университет — KZ 70", "politecnico di milano — 165 000 / IN 12 100 / PK 3 600"),
   ("bologna", "university-of-bologna", "University of Bologna", "italy-bologna.md", "university of bologna — KZ 1 300 / UZ 1 300 / AZ 720; университет болоньи — KZ 90", "university of bologna — 246 000 / PK 18 100 / IN 14 800 / NG 2 400"),
  ],
 },
 "spain": {
  "name_ru": "Испании", "name_en": "Spain", "hub_ru": "/ru/ucheba-v-ispanii", "hub_en": "/study-in-spain",
  "facts": "spain.md",
  "kw_note": "RU — Google Ads KZ / UZ / KG / AZ; EN — мир / PK / IN / NG (DataForSEO 21.09.2026, content/keywords/spain-*.json). Мировые объёмы брендов вузов в основном испанские; для иностранцев важнее визы, поступление и магистратура.",
  "audience_ru": "абитуриенты и родители из Казахстана, Узбекистана, Кыргызстана, Азербайджана, России, Беларуси; также взрослые, которые рассматривают магистратуру и переезд",
  "audience_en": "applicants and parents from Pakistan, India, Nigeria, Bangladesh, Egypt, GCC; also graduates considering a master's and staying to work",
  "honesty_ru": "Честно про: после въезда туристом подать на учёбу изнутри Испании можно только в определённых случаях и в сжатые сроки — языковые курсы так не оформить (строго по сводке); большинство программ госвузов на испанском, в Каталонии часть — на каталанском; разницу официальных дипломов (título oficial) и собственных (título propio) для прав на работу; финансовый минимум по IPREM; жильё в Мадриде и Барселоне дорогое.",
  "honesty_en": "Be honest about: after entering as a tourist you can apply for a study stay from inside Spain only in specific cases and short timeframes — not for language courses (strictly per the fact sheet); most public-university programmes are in Spanish, some in Catalan in Catalonia; official vs university-own degrees (título oficial vs título propio) and work rights; the IPREM financial minimum; expensive housing in Madrid and Barcelona.",
  "hub": {"ru_kw": "учеба в испании (KZ 20); обучение в испании (10); университеты испании (KZ 50)", "en_kw": "study in spain (4 400 / PK 320 / IN 480); universities in spain (12 100 / IN 1 000 / PK 590 / NG 480)"},
  "topics": [
   {"key": "visa", "ru_slug": "studencheskaya-viza-v-ispaniyu", "en_slug": "spain-student-visa",
    "ru_title": "Студенческая виза в Испанию и разрешение на учёбу", "en_title": "Spain student visa and study stay authorization",
    "ru_kw": "студенческая виза в испанию (10)", "en_kw": "spain student visa (6 600 / IN 720 / PK 320)",
    "focus": "estancia por estudios по RD 1155/2024: кто может, документы, финансы по IPREM, страховка без доплат, подача через консульство или изнутри страны (условия), сроки, сборы, продление, семья"},
   {"key": "admission", "ru_slug": "postuplenie-v-ispaniyu", "en_slug": "admission-requirements",
    "ru_title": "Поступление в вузы Испании: омологация, UNEDasiss, документы", "en_title": "Admission to Spanish universities: homologation, UNEDasiss and documents",
    "ru_kw": "поступление в испанию (KZ 30); омологация аттестата (10); университеты испании (KZ 50)", "en_kw": "universities in spain (12 100); study in spain for international students (590)",
    "focus": "бакалавриат: омологация/UNEDasiss, PAU/PCE, предрегистрация, квоты; апостиль и присяжный перевод; частные вузы и их тесты; язык; календарь 2027/28 без выдуманных дат"},
   {"key": "masters", "ru_slug": "magistratura-v-ispanii", "en_slug": "masters-in-spain",
    "ru_title": "Магистратура в Испании", "en_title": "Master's degree in Spain",
    "ru_kw": "магистратура в испании (10); бизнес школы испании (10)", "en_kw": "masters in spain (2 900 / IN 260)",
    "focus": "официальные и собственные магистратуры, цены за ECTS для не-ЕС в госвузах, частные вузы, требования, сроки предрегистрации, права на работу и после выпуска"},
   {"key": "work", "ru_slug": "rabota-vo-vremya-ucheby-v-ispanii", "en_slug": "study-and-work-in-spain",
    "ru_title": "Работа во время учёбы и после выпуска в Испании", "en_title": "Study and work in Spain: work rights and job search after graduation",
    "ru_kw": "языковые курсы в испании (10); стоимость обучения в испании (10)", "en_kw": "spain job seeker visa (2 900 / PK 260 / IN 480); spanish language courses in spain (5 400); study and work in spain (320)",
    "focus": "сколько часов можно работать студенту, где (автономное сообщество), разрешение на поиск работы после учёбы (срок), переход на рабочий статус, языковые курсы — что они дают и чего не дают по визе (строго по сводке)"},
  ],
  "cards": [
   ("ucam", "ucam", "UCAM — Universidad Católica de Murcia", "spain-ucam.md", "ucam — KZ 20 / AZ 20", "ucam — 135 000 (в основном Испания) / IN 1 000"),
   ("europea", "universidad-europea", "Universidad Europea", "spain-europea.md", "universidad europea — KZ 40 / AZ 40", "universidad europea — 74 000 / IN 720"),
   ("ceu", "ceu-san-pablo-university", "Universidad CEU San Pablo", "spain-ceu.md", "ceu san pablo — KZ 20", "ceu san pablo university — 1 300"),
   ("complutense", "complutense-university-of-madrid", "Universidad Complutense de Madrid", "spain-complutense.md", "universidad complutense de madrid — KZ 30 / AZ 20 / UZ 20", "universidad complutense de madrid — 135 000 (в основном Испания)"),
   ("barcelona", "university-of-barcelona", "Universitat de Barcelona", "spain-barcelona.md", "university of barcelona — AZ 170 / KZ 140 / UZ 110", "university of barcelona — 33 100 / IN 2 900 / PK 1 300 / NG 720"),
  ],
 },
 "hungary": {
  "name_ru": "Венгрии", "name_en": "Hungary", "hub_ru": "/ru/ucheba-v-vengrii", "hub_en": "/study-in-hungary",
  "facts": "hungary.md",
  "kw_note": "RU — Google Ads KZ / UZ / KG / AZ; EN — мир / PK / IN / NG (DataForSEO 22.09.2026, content/keywords/hungary-*.json). Главный спрос — Stipendium Hungaricum и госвузы (Debrecen, Pécs, Semmelweis); по IBS и McDaniel поискового спроса нет.",
  "audience_ru": "абитуриенты и родители из Казахстана, Узбекистана, Кыргызстана, Азербайджана, России, Беларуси; большой интерес к бесплатной учёбе по Stipendium Hungaricum",
  "audience_en": "applicants and parents from Pakistan (largest demand), India, Nigeria, Bangladesh, Egypt; GCC expat families (note: Saudi Arabia, Qatar and Kuwait are not eligible for Stipendium Hungaricum; UAE, Oman and Bahrain are — per the fact sheet)",
  "honesty_ru": "Честно про: Stipendium Hungaricum — большой конкурс, нужна номинация своей страны, и она не покрывает всё; медицина на английском — вступительный экзамен и высокий отсев; изменения в управлении вузами (фонды, 2027) — только по сводке; где нужен венгерский язык; реальную стоимость жизни.",
  "honesty_en": "Be honest about: Stipendium Hungaricum is competitive, requires nomination by your country and does not cover everything; English-taught medicine has entrance exams and high dropout; changes in university governance (foundations, 2027) — only per the fact sheet; where Hungarian is needed; real living costs.",
  "hub": {"ru_kw": "учеба в венгрии (KZ 20); университеты венгрии (KZ 50)", "en_kw": "study in hungary (2 900 / PK 480 / IN 320); universities in hungary (6 600 / PK 720 / IN 590)"},
  "topics": [
   {"key": "stipendium", "ru_slug": "stipendium-hungaricum", "en_slug": "stipendium-hungaricum",
    "ru_title": "Stipendium Hungaricum: бесплатная учёба в Венгрии", "en_title": "Stipendium Hungaricum scholarship",
    "ru_kw": "stipendium hungaricum (KZ 1 900, UZ 1 300, KG 590, AZ 480); стипендиум хунгарикум (KZ 140); стипендия венгрии (10)", "en_kw": "stipendium hungaricum (49 500 / PK 4 400 / IN 1 900 / NG 1 600)",
    "focus": "кто может подать (страны), что покрывает, стипендия в месяц, номинация своей страны, шаги и сроки (2027/28 — как не объявлено), выбор программ, мотивационное письмо, шансы, обязательства, план Б"},
   {"key": "medicine", "ru_slug": "medicina-v-vengrii", "en_slug": "medicine-in-hungary",
    "ru_title": "Медицина в Венгрии на английском", "en_title": "Studying medicine in Hungary in English",
    "ru_kw": "медицина в венгрии (10); semmelweis (KZ 50); дебреценский университет (KZ 90)", "en_kw": "mbbs in hungary (260 / IN 140); medicine in hungary (210); university of pecs (33 100); semmelweis university (27 100)",
    "focus": "вузы с медициной на английском (Semmelweis, Debrecen, Szeged, Pécs), вступительные экзамены, подготовительные курсы, стоимость по вузам (таблица), венгерский в клинике, признание диплома (только ✅)"},
   {"key": "visa", "ru_slug": "studencheskaya-viza-v-vengriyu", "en_slug": "hungary-student-visa",
    "ru_title": "Студенческий ВНЖ в Венгрию", "en_title": "Hungary student visa and residence permit",
    "ru_kw": "студенческая виза в венгрию (10)", "en_kw": "hungary student visa (880 / IN 170 / PK 70)",
    "focus": "разрешение на пребывание для учёбы: подача из-за рубежа через консульство (строго по сводке), документы, финансы, страховка, сроки, сборы, работа 30 ч/нед, поиск работы после выпуска"},
   {"key": "cost", "ru_slug": "stoimost-obucheniya-v-vengrii", "en_slug": "cost-of-studying-in-hungary",
    "ru_title": "Стоимость обучения и жизни в Венгрии", "en_title": "Cost of studying and living in Hungary",
    "ru_kw": "стоимость обучения в венгрии (10)", "en_kw": "cost of studying in hungary (10)",
    "focus": "цены по типам вузов и программам (в валюте вуза), жизнь в Будапеште и Дебрецене, страховка, пример бюджета на год, стипендии и скидки"},
  ],
  "cards": [
   ("metu", "metropolitan-university-budapest", "Budapest Metropolitan University (METU)", "hungary-metu.md", "metu budapest — 10", "metropolitan university budapest — 880"),
   ("ibs", "ibs-budapest", "IBS — International Business School Budapest", "hungary-ibs.md", "поискового спроса нет — страница работает на конверсию", "no search demand — conversion page"),
   ("mcdaniel", "mcdaniel-college-budapest", "McDaniel College Budapest", "hungary-mcdaniel.md", "поискового спроса нет — страница работает на конверсию", "no search demand — conversion page"),
   ("debrecen", "university-of-debrecen", "University of Debrecen", "hungary-debrecen.md", "university of debrecen — KZ 590 / UZ 390 / AZ 320; дебреценский университет — KZ 90", "university of debrecen — 40 500 / PK 4 400 / IN 2 900 / NG 1 900"),
   ("semmelweis", "semmelweis-university", "Semmelweis University", "hungary-semmelweis.md", "semmelweis — KZ 50 / UZ 40", "semmelweis university — 27 100 / IN 1 300 / PK 720"),
  ],
 },
 "georgia": {
  "name_ru": "Грузии", "name_en": "Georgia", "hub_ru": "/ru/ucheba-v-gruzii", "hub_en": "/study-in-georgia",
  "facts": "georgia.md",
  "kw_note": "RU — Google Ads KZ / UZ / KG / AZ; EN — мир / PK / IN / NG (DataForSEO 22.09.2026, content/keywords/georgia-*.json). EN-спрос почти целиком индийский и медицинский (MBBS); в RU заметен Узбекистан (tsmu — UZ 880).",
  "audience_ru": "абитуриенты и родители из Узбекистана, Казахстана, Азербайджана, Кыргызстана, России, Беларуси; основной интерес — медицина",
  "audience_en": "applicants and parents from India (dominant, MBBS), Pakistan, Nigeria, Egypt, GCC",
  "honesty_ru": "Честно про: для самостоятельной врачебной практики в Грузии нужен грузинский, выпускник получает статус младшего врача; признание грузинского аккредитатора WFME действует до 11.2028; правила признания диплома дома (для Индии — NMC) нужно проверить до поступления; финансовые требования к визе не зафиксированы официально — только по сводке.",
  "honesty_en": "Be honest about: independent medical practice in Georgia requires Georgian and graduates get junior doctor status; WFME recognition of Georgia's accreditor runs to 11.2028; home-country licensing rules (India — NMC FMGL 2021) must be checked before applying — only facts from the sheets; no official fixed financial amount for the visa.",
  "hub": {"ru_kw": "учеба в грузии (10); университеты грузии (KZ 20); tsmu (UZ 880)", "en_kw": "universities in georgia (8 100 / NG 260); study in georgia (1 300 / IN 480)"},
  "topics": [
   {"key": "medicine", "ru_slug": "medicina-v-gruzii", "en_slug": "mbbs-in-georgia",
    "ru_title": "Медицина в Грузии на английском", "en_title": "MBBS in Georgia: fees, recognition and the honest picture",
    "ru_kw": "медицина в грузии (10); tsmu (UZ 880, AZ 140); тбилисский государственный медицинский университет (10–20)", "en_kw": "mbbs in georgia (9 900 / IN 9 900); mbbs in georgia fees (880 / IN 880); study medicine in georgia (260); is mbbs in georgia valid in india (50)",
    "focus": "англоязычные программы MD (6 лет), цены по вузам (таблица), язык клинической практики и работы, аккредитация и WFME до 11.2028, NMC FMGL 2021 и риски для индийских студентов (только из сводок), признание в СНГ — проверить до поступления"},
   {"key": "admission", "ru_slug": "postuplenie-v-gruziyu", "en_slug": "admission-requirements",
    "ru_title": "Поступление в вузы Грузии: документы и признание NCEQE", "en_title": "Admission to Georgian universities: documents and NCEQE recognition",
    "ru_kw": "поступление в грузию (10); университеты грузии (KZ 20)", "en_kw": "universities in georgia (8 100); study in georgia (1 300)",
    "focus": "признание аттестата через NCEQE (процесс, сроки, сборы), документы и апостиль по странам, требования вузов, подготовительный язык, сроки 2027 без выдуманных дат"},
   {"key": "visa", "ru_slug": "studencheskaya-viza-i-vnzh-v-gruzii", "en_slug": "georgia-student-visa",
    "ru_title": "Студенческая виза D3 и ВНЖ в Грузии", "en_title": "Georgia student visa (D3) and residence permit",
    "ru_kw": "студенческая виза в грузию, внж в грузии для студентов (малый спрос)", "en_kw": "georgia student visa (480 / IN 170)",
    "focus": "безвиз по странам, виза D3 (документы, сборы), ВНЖ для учёбы (сроки подачи, сборы, документы — строго по сводке), работа студентов и изменения 2026 года"},
   {"key": "cost", "ru_slug": "stoimost-obucheniya-v-gruzii", "en_slug": "cost-of-studying-in-georgia",
    "ru_title": "Стоимость обучения и жизни в Грузии", "en_title": "Cost of studying and living in Georgia",
    "ru_kw": "стоимость обучения в грузии (10)", "en_kw": "mbbs in georgia fees (880); cost of studying in georgia (0)",
    "focus": "цены по вузам и программам (медицина и другие), жизнь в Тбилиси и Батуми, ВНЖ и страховка как обязательные расходы, пример бюджета на год"},
  ],
  "cards": [
   ("ug", "university-of-georgia", "University of Georgia (UG)", "georgia-ug.md", "university of georgia — KZ 90 / UZ 90 / AZ 50", "university of georgia tbilisi — 14 800 / IN 2 400"),
   ("seu", "seu-georgian-national-university", "SEU — Georgian National University", "georgia-seu.md", "seu university — 10", "seu georgia — 9 900 / IN 6 600"),
   ("alte", "alte-university", "Alte University", "georgia-alte.md", "alte university — 10–20", "alte university — 9 900 / IN 1 000 / PK 260"),
   ("tsmu", "tbilisi-state-medical-university", "Tbilisi State Medical University (TSMU)", "georgia-tsmu.md", "tsmu — UZ 880 / AZ 140; тбилисский государственный медицинский университет — 10–20", "tbilisi state medical university — 27 100 / IN 9 900 / PK 320"),
   ("tsu", "tbilisi-state-university", "Tbilisi State University (TSU)", "georgia-tsu.md", "тбилисский государственный университет — KZ 30 / AZ 30", "tbilisi state university — 3 600 / IN 320"),
  ],
 },
 "north-cyprus": {
  "name_ru": "Северном Кипре", "name_en": "North Cyprus", "hub_ru": "/ru/ucheba-na-severnom-kipre", "hub_en": "/study-in-north-cyprus",
  "facts": "north-cyprus.md",
  "kw_note": "RU — Google Ads KZ / UZ / KG / AZ; EN — мир / PK / IN / NG (DataForSEO 22.09.2026, content/keywords/cyprus-*.json). Спрос — бренды вузов (по ~9 900 в мире на EMU, NEU, CIU, GAU); в RU заметен Girne American University.",
  "audience_ru": "абитуриенты и родители из Казахстана, Узбекистана, Азербайджана, Кыргызстана, России, Беларуси, которых привлекают цена и обучение на английском",
  "audience_en": "applicants and parents from Pakistan, Nigeria, India, Bangladesh, Egypt, GCC",
  "honesty_ru": "ОБЯЗАТЕЛЬНО по правилу системного промпта о Северном Кипре: ТРСК признана только Турцией, дипломы напрямую не признаются в ЕС и Республике Кипр, рабочий путь — YÖDAK + признание YÖK, для иностранцев — denklik; в Казахстане есть прямое основание для отказа (по сводке); въезд только через Турцию, риски перехода на юг — по сводке; скидки часто не распространяются на медицину.",
  "honesty_en": "MANDATORY per the system prompt's North Cyprus rule: TRNC is recognised only by Turkey, degrees are not automatically recognised in the EU or the Republic of Cyprus; the working path is YÖDAK + YÖK recognition, foreigners need denklik; entry is via Turkey only; crossing to the South has risks (per fact sheet); discounts often exclude medicine.",
  "hub": {"ru_kw": "учеба на северном кипре (10); университеты северного кипра (KZ 20)", "en_kw": "north cyprus universities / universities in north cyprus (720 / PK 170); study in north cyprus (590)"},
  "topics": [
   {"key": "diploma-recognition", "ru_slug": "priznanie-diploma", "en_slug": "degree-recognition",
    "ru_title": "Признают ли диплом Северного Кипра", "en_title": "Is a North Cyprus degree recognised? The honest answer",
    "ru_kw": "учеба на северном кипре; университеты северного кипра", "en_kw": "north cyprus universities (720); study in north cyprus (590)",
    "focus": "статус ТРСК, YÖDAK и YÖK, denklik для иностранцев, легализация через Турцию, где диплом работает и где нет (таблица), кому подходит, альтернативы в ЕС"},
   {"key": "visa", "ru_slug": "viza-i-vnzh", "en_slug": "student-visa-and-residence",
    "ru_title": "Въезд, виза и студенческий ВНЖ на Северном Кипре", "en_title": "North Cyprus student visa, entry and residence permit",
    "ru_kw": "студенческая виза на кипр (10)", "en_kw": "cyprus student visa (1 600 — в основном Юг; для Севера объяснить разницу)",
    "focus": "въезд через Турцию, турецкая виза/безвиз по странам, e-Visa ТРСК, студенческий ВНЖ (шаги, медосмотр, сборы в TL), правила перехода на юг, работа студентов (по сводке)"},
   {"key": "cost", "ru_slug": "stoimost-obucheniya", "en_slug": "tuition-fees-and-living-costs",
    "ru_title": "Стоимость обучения и жизни на Северном Кипре", "en_title": "North Cyprus tuition fees and living costs",
    "ru_kw": "стоимость обучения на кипре (10)", "en_kw": "cost of studying in cyprus (10)",
    "focus": "цены по вузам 2026/27 со стандартными скидками (таблица), медицина отдельно, общежития, стоимость жизни, валюта TRY, пример бюджета на год"},
   {"key": "admission", "ru_slug": "postuplenie", "en_slug": "admission-requirements",
    "ru_title": "Поступление в вузы Северного Кипра", "en_title": "Admission to North Cyprus universities",
    "ru_kw": "университеты северного кипра (KZ 20); учеба на северном кипре", "en_kw": "universities in north cyprus (720); study in north cyprus (590)",
    "focus": "требования (аттестат, английский, без экзаменов), документы и апостиль, наборы, подготовительный английский, как выбрать вуз и программу с учётом признания"},
  ],
  "cards": [
   ("ciu", "cyprus-international-university", "Cyprus International University (CIU)", "ncyprus-ciu.md", "ciu cyprus — 10; кипрский международный университет — KZ 20", "cyprus international university — 9 900 / PK 1 000 / NG 590"),
   ("neu", "near-east-university", "Near East University (NEU)", "ncyprus-neu.md", "neu cyprus — 10; ближневосточный университет — 10", "near east university — 9 900 / PK 590 / NG 480"),
   ("gau", "girne-american-university", "Girne American University (GAU)", "ncyprus-gau.md", "girne american university — KZ 90 / AZ 70", "girne american university — 9 900 / IN 1 900 / PK 320"),
   ("emu", "eastern-mediterranean-university", "Eastern Mediterranean University (EMU)", "ncyprus-emu.md", "emu cyprus — KZ 30; восточно-средиземноморский университет — 10", "eastern mediterranean university — 9 900 / NG 590 / PK 480"),
   ("metu-ncc", "metu-northern-cyprus-campus", "METU Northern Cyprus Campus", "ncyprus-metu-ncc.md", "малый спрос", "metu northern cyprus — 320"),
  ],
 },
 "south-cyprus": {
  "name_ru": "Южном Кипре", "name_en": "Cyprus", "hub_ru": "/ru/ucheba-na-yuzhnom-kipre", "hub_en": "/study-in-cyprus",
  "facts": "south-cyprus.md",
  "kw_note": "RU — Google Ads KZ / UZ / KG / AZ; EN — мир / PK / IN / NG (DataForSEO 22.09.2026, content/keywords/cyprus-*.json). Спрос — бренды частных вузов (European University Cyprus 33 100, University of Nicosia 27 100, UCLan Cyprus 18 100) и студенческая виза (1 600).",
  "audience_ru": "абитуриенты и родители из Казахстана, Узбекистана, Азербайджана, Кыргызстана, России, Беларуси, которым нужен диплом ЕС",
  "audience_en": "applicants and parents from Pakistan, India, Nigeria, Bangladesh, Egypt, GCC who want an EU degree",
  "honesty_ru": "Честно про: это Республика Кипр (ЕС), не путать с Северным Кипром; банковская гарантия и финансовые требования зависят от страны (строго по сводке); в госвузах бакалавриат в основном на греческом; работа студентов ограничена (по сводке); Кипр — в ЕС, но статус Шенгена — по сводке; стоимость жизни в Лимассоле выше.",
  "honesty_en": "Be honest about: this is the Republic of Cyprus (EU), not North Cyprus; bank guarantee and financial requirements depend on nationality (strictly per the fact sheet); public-university bachelor's programmes are mostly in Greek; student work is restricted (per fact sheet); Cyprus is in the EU but check Schengen status per the fact sheet; Limassol is more expensive.",
  "hub": {"ru_kw": "учеба на кипре (10); университеты кипра (KZ 20); обучение на кипре", "en_kw": "universities in cyprus (5 400 / PK 590 / IN 390); study in cyprus (1 000 / PK 320)"},
  "topics": [
   {"key": "visa", "ru_slug": "studencheskaya-viza-na-kipr", "en_slug": "cyprus-student-visa",
    "ru_title": "Студенческая виза и въезд на Кипр (Республика Кипр)", "en_title": "Cyprus student visa and entry permit",
    "ru_kw": "студенческая виза на кипр (KZ 10)", "en_kw": "cyprus student visa (1 600 / IN 720 / PK 390)",
    "focus": "разрешение на въезд через вуз (CRMD), документы, сборы, банковская гарантия по странам (таблица), ВНЖ и продление, работа студентов"},
   {"key": "admission", "ru_slug": "universitety-i-postuplenie", "en_slug": "universities-and-admission",
    "ru_title": "Университеты Кипра и поступление", "en_title": "Universities in Cyprus and admission requirements",
    "ru_kw": "университеты кипра (KZ 20); обучение на кипре", "en_kw": "universities in cyprus (5 400); university of cyprus (5 400)",
    "focus": "госвузы и частные вузы (таблица), язык обучения, требования, документы и апостиль, сроки 2027/28 без выдуманных дат, признание дипломов ЕС"},
   {"key": "medicine", "ru_slug": "medicina-na-kipre", "en_slug": "medicine-in-cyprus",
    "ru_title": "Медицина на Кипре на английском", "en_title": "Studying medicine in Cyprus",
    "ru_kw": "медицина на кипре (10)", "en_kw": "mbbs in cyprus (70); study medicine in cyprus (70)",
    "focus": "программы медицины на английском (UNIC, EUC), стоимость, требования, аккредитация, признание в ЕС, практика"},
   {"key": "cost", "ru_slug": "stoimost-obucheniya-na-kipre", "en_slug": "cost-of-studying-in-cyprus",
    "ru_title": "Стоимость обучения и жизни на Кипре", "en_title": "Cost of studying and living in Cyprus",
    "ru_kw": "стоимость обучения на кипре (10)", "en_kw": "cost of studying in cyprus (10)",
    "focus": "цены госвузов и частных вузов для не-ЕС, жизнь в Никосии, Лимассоле, Ларнаке, банковская гарантия и страховка как обязательные расходы, пример бюджета"},
  ],
  "cards": [
   ("unic", "university-of-nicosia", "University of Nicosia (UNIC)", "scyprus-unic.md", "university of nicosia — KZ 50", "university of nicosia — 27 100 / PK 880 / IN 880"),
   ("euc", "european-university-cyprus", "European University Cyprus (EUC)", "scyprus-euc.md", "european university cyprus — KZ 30", "european university cyprus — 33 100 / PK 480"),
   ("uclan", "uclan-cyprus", "UCLan Cyprus", "scyprus-uclan.md", "uclan cyprus — 10", "uclan cyprus — 18 100 / IN 1 300 / PK 880"),
   ("ucy", "university-of-cyprus", "University of Cyprus (UCY)", "scyprus-ucy.md", "university of cyprus — KZ 40", "university of cyprus — 5 400 / PK 590"),
   ("cut", "cyprus-university-of-technology", "Cyprus University of Technology (CUT)", "scyprus-cut.md", "малый спрос", "cyprus university of technology — 3 600 / PK 260"),
  ],
 },
}

def links(c, lang):
    if lang == "ru":
        base = c["hub_ru"]; out = [base] + [f"{base}/{t['ru_slug']}" for t in c["topics"]] + [f"{base}/{k[1]}" for k in c["cards"]] + ["/ru/kontakty"]
    else:
        base = c["hub_en"]; out = [base] + [f"{base}/{t['en_slug']}" for t in c["topics"]] + [f"{base}/{k[1]}" for k in c["cards"]] + ["/contacts"]
    return ", ".join(f"`{l}`" for l in out)

def facts_list(c):
    return ", ".join(f"`content/facts/{f}`" for f in [c["facts"]] + [k[3] for k in c["cards"]])

def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if os.path.exists(path):
        print("skip (exists)", path); return
    open(path, "w", encoding="utf-8", newline="\n").write(text)

def hub(c, lang):
    if lang == "ru":
        return f"""# Бриф: хаб «Учёба в {c['name_ru']}» (RU)

- **URL:** `{c['hub_ru']}`
- **Тип:** country-hub (родитель всех RU-страниц страны)
- **Аудитория:** {c['audience_ru']}.
- **Интент:** «подходит ли мне эта страна, сколько стоит, как поступить, какая виза, в чём подвох».
- **Сводки фактов:** {facts_list(c)}. Других черновиков не читать.

## Ключевые слова

{c['kw_note']}

{c['hub']['ru_kw']}

## Структура

1. **Вступление** (без H2): кому страна подходит и кому нет — честно, 3 абзаца; главный ключ в первом абзаце.
2. **H2: Сколько стоит учёба** — таблица диапазонов по уровням и типам вузов с годом прайса.
3. **H2: Какие бывают вузы** — сравнение типов вузов (таблица).
4. **H2: Как поступить** — processBlock 5–6 шагов + требования к документам для СНГ.
5. **video slot:** «Как проходит поступление: от заявки до визы», 90 сек.
6. **H2: Виза и документы** — коротко, со ссылкой на страницу о визе.
7. **surveyBlock**
8. **H2: Что важно знать заранее** — {c['honesty_ru']}
9. **H2: Жизнь, работа и стоимость жизни** — только из сводки.
10. **H2: Вузы, с которыми мы работаем** — 5 вузов по 1–2 предложения со ссылками на карточки.
11. **video slot:** «День студента», 60 сек.
12. **accordionBlock** — FAQ 6–8.
13. **cta** — бесплатная консультация: оценим документы, подберём 3–4 программы под бюджет, распишем визовый маршрут.

## Внутренние ссылки

{links(c, 'ru')}, `/ru/obuchenie-v-polshe` (одно предложение как альтернатива в ЕС)
"""
    return f"""# Brief: Study in {c['name_en']} hub (EN)

- **URL:** `{c['hub_en']}`
- **Type:** country-hub (parent of all EN pages for the country)
- **Audience:** {c['audience_en']}.
- **Intent:** "Is this country right for me, how much, how do I get in, which visa, what's the catch?"
- **Fact sheets:** {facts_list(c)}. Do not read other drafts.

## Keywords

{c['kw_note']}

{c['hub']['en_kw']}

## Structure

1. **Intro** (no H2): who the country suits and who it doesn't, 3 short paragraphs; primary keyword in the first sentence.
2. **H2: How much does it cost** — ranges by level and university type, with price-list year.
3. **H2: Types of universities** — comparison table.
4. **H2: Admission requirements** — processBlock 5–6 steps + documents by country.
5. **video slot:** "How admission works: from application to visa", 90 sec.
6. **H2: Student visa and documents** — short, link to the visa page.
7. **surveyBlock**
8. **H2: What to know before you apply** — {c['honesty_en']}
9. **H2: Living costs, work and student life** — fact sheet only.
10. **H2: Universities we work with** — 5 universities, 1–2 sentences each with links.
11. **video slot:** "A day as an international student", 60 sec.
12. **accordionBlock** — FAQ 6–8.
13. **cta** — free consultation: check documents, shortlist 3–4 programs, map the visa route.

## Allowed internal links

{links(c, 'en')}, `/study-in-poland` (one sentence, EU alternative)
"""

def topic(c, t, lang):
    if lang == "ru":
        return f"""# Бриф: «{t['ru_title']}» (RU)

- **URL:** `{c['hub_ru']}/{t['ru_slug']}`
- **Тип:** topic (дочерняя страница хаба)
- **Аудитория:** {c['audience_ru']}.
- **Содержание:** {t['focus']}.
- **Сводки фактов:** {facts_list(c)}. Других черновиков не читать.

## Ключевые слова

{c['kw_note']}

{t['ru_kw']}

## Структура

1. **Вступление** (без H2): прямой ответ на главный вопрос страницы в первых двух предложениях.
2. 4–6 разделов H2 по теме (см. «Содержание»), с таблицей там, где сравниваются 3+ объекта, и processBlock для шагов.
3. **video slot** — там, где видео объяснит лучше текста, 60–90 сек.
4. **surveyBlock** — в середине страницы.
5. **H2: Что важно знать заранее** — {c['honesty_ru']}
6. **accordionBlock** — FAQ 6–8 из реальных вопросов по теме.
7. **cta** — конкретный следующий шаг с AcademGo по этой теме.

## Внутренние ссылки (не ссылаться на саму себя)

{links(c, 'ru')}
"""
    return f"""# Brief: "{t['en_title']}" (EN)

- **URL:** `{c['hub_en']}/{t['en_slug']}`
- **Type:** topic (child of the hub)
- **Audience:** {c['audience_en']}.
- **Content:** {t['focus']}.
- **Fact sheets:** {facts_list(c)}. Do not read other drafts.

## Keywords

{c['kw_note']}

{t['en_kw']}

## Structure

1. **Intro** (no H2): answer the page's main question in the first two sentences.
2. 4–6 H2 sections on the topic (see "Content"), tables where 3+ items are compared, processBlock for steps.
3. **video slot** where video explains better than text, 60–90 sec.
4. **surveyBlock** mid-page.
5. **H2: What to know before you apply** — {c['honesty_en']}
6. **accordionBlock** — FAQ 6–8 from real questions on the topic.
7. **cta** — a concrete next step with AcademGo on this topic.

## Allowed internal links (never link to the page itself)

{links(c, 'en')}
"""

def card(c, k, lang):
    folder, slug, name, facts, kw_ru, kw_en = k
    if lang == "ru":
        return f"""# Бриф: карточка {name} (RU)

- **URL:** `{c['hub_ru']}/{slug}`
- **Тип:** university-card
- **Аудитория:** {c['audience_ru']}.
- **Сводки фактов:** `content/facts/{facts}` (вуз) + `content/facts/{c['facts']}` (страна: виза, документы, жизнь). Других черновиков не читать.

## Ключевые слова

{kw_ru}. RU-аудитория ищет вуз латиницей: название латиницей — в H1, meta title и первом абзаце.

## Структура

1. **Вступление** (без H2): что это за вуз в 3 предложениях + кому подходит и кому нет.
2. **Таблица ключевых фактов** (только ✅).
3. **H2: Стоимость обучения** — таблица по программам с годом прайса; если цен нет в сводке — честно «уточняем под вашу программу».
4. **H2: Программы и какой диплом вы получаете**.
5. **video slot:** «Кампус {name}», 60–90 сек.
6. **H2: Как поступить из СНГ** — processBlock: требования, английский, документы и их заверение, сроки 2027 (без выдуманных дат).
7. **H2: Что важно знать заранее** — честные ограничения вуза и страны.
8. **surveyBlock**
9. **H2: Рейтинги и аккредитация** — только ✅.
10. **H2: Жильё и жизнь студента**.
11. **H2: Виза** — коротко, ссылка на страницу о визе.
12. **H2: Другие варианты** — 1 абзац со ссылками на другие карточки.
13. **accordionBlock** — FAQ 6–8.
14. **cta** — проверим документы под требования {name} и сравним с 2–3 альтернативами.

Если сводка говорит, что вуз не работает с агентствами, — действуй по правилу системного промпта.

## Внутренние ссылки (не ссылаться на саму себя)

{links(c, 'ru')}
"""
    return f"""# Brief: {name} university card (EN)

- **URL:** `{c['hub_en']}/{slug}`
- **Type:** university-card
- **Audience:** {c['audience_en']}.
- **Fact sheets:** `content/facts/{facts}` (university) + `content/facts/{c['facts']}` (country: visa, documents, living). Do not read other drafts.

## Keywords

{kw_en}

## Structure

1. **Intro** (no H2): what the university is in 3 sentences + who it suits and who it doesn't.
2. **Key facts table** (✅ only).
3. **H2: Tuition fees** — table by program with price-list year; if no fees in the fact sheet, say honestly we confirm them for your program.
4. **H2: Programs and the degree you receive**.
5. **video slot:** "{name} campus walkthrough", 60–90 sec.
6. **H2: Admission requirements for international students** — processBlock: grades by curriculum, English, documents and certification, 2027 timeline (no invented dates).
7. **H2: What to know before you apply** — honest limitations.
8. **surveyBlock**
9. **H2: Rankings and accreditation** — ✅ only.
10. **H2: Housing and student life**.
11. **H2: Student visa** — short, link to the visa page.
12. **H2: Other options** — one paragraph with links.
13. **accordionBlock** — FAQ 6–8.
14. **cta** — we check your documents against {name}'s requirements and compare 2–3 alternatives.

If the fact sheet says the university does not work with agencies, follow the system prompt rule.

## Allowed internal links (never link to the page itself)

{links(c, 'en')}
"""

def main(key):
    c = COUNTRIES[key]; base = os.path.join(ROOT, "drafts", key)
    rows = []
    write(os.path.join(base, "hub-ru", "brief.md"), hub(c, "ru")); rows.append(("hub-ru", c["hub_ru"]))
    write(os.path.join(base, "hub-en", "brief.md"), hub(c, "en")); rows.append(("hub-en", c["hub_en"]))
    for t in c["topics"]:
        write(os.path.join(base, f"{t['key']}-ru", "brief.md"), topic(c, t, "ru")); rows.append((f"{t['key']}-ru", f"{c['hub_ru']}/{t['ru_slug']}"))
        write(os.path.join(base, f"{t['key']}-en", "brief.md"), topic(c, t, "en")); rows.append((f"{t['key']}-en", f"{c['hub_en']}/{t['en_slug']}"))
    for k in c["cards"]:
        write(os.path.join(base, f"{k[0]}-ru", "brief.md"), card(c, k, "ru")); rows.append((f"{k[0]}-ru", f"{c['hub_ru']}/{k[1]}"))
        write(os.path.join(base, f"{k[0]}-en", "brief.md"), card(c, k, "en")); rows.append((f"{k[0]}-en", f"{c['hub_en']}/{k[1]}"))
    plan = f"# {key}: карта страниц ({len(rows)})\n\n{c['kw_note']}\n\n| Папка | URL | Статус |\n|---|---|---|\n" + "\n".join(f"| {f} | {u} | бриф |" for f, u in rows) + "\n"
    write(os.path.join(base, "_plan.md"), plan)
    print(key, len(rows), "pages")

if __name__ == "__main__":
    for k in sys.argv[1:]: main(k)
