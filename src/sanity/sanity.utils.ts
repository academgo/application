import { groq } from "next-sanity";
import { client } from "./sanity.client";
import { Post } from "@/types/post";
import { Header } from "@/types/header";
import { Homepage } from "@/types/homepage";
import { Footer } from "@/types/footer";
import { Blog } from "@/types/blog";
import { BlogPage } from "@/types/blogPage";
import { SuccessPage } from "@/types/successPage";
import { NotFoundPage } from "@/types/notFoundPage";
import { FormStandardDocument } from "@/types/formStandardDocument";
import { Singlepage } from "@/types/singlepage";
import { Subpage } from "@/types/subpage";
import { Country, University } from "@/types/country";
import { pageHref } from "@/lib/pageHref";

// for the query can be adjusted to be data that you need
export async function getPostsByLang(lang: string): Promise<Post[]> {
  const postQuery = groq`*[_type == 'post' && language == $lang] {
        _id,
        title,
        slug,
        language,
        description,
        "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
          slug,
        },
      }`;

  const posts = await client.fetch(postQuery, { lang });

  return posts;
}

export async function getPostByLang(lang: string, slug: string): Promise<Post> {
  const postQuery = groq`*[_type == 'post' && slug[$lang].current == $slug][0] {
        _id,
        title,
        slug,
        language,
        description,
        "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
          slug,
        },
      }`;

  const post = await client.fetch(postQuery, { lang, slug });

  return post;
}

export async function getBlogPageByLang(lang: string): Promise<BlogPage> {
  const blogPageQuery = groq`*[_type == "blogPage" && language == $lang][0] {
    _id,
    metaTitle,
    metaDescription,
    faq,
    language,
    "_translations": *[_type == "translation.metadata" && references(select(^._id in path("drafts.**") => string::split(^._id, "drafts.")[1], ^._id))].translations[].value->{
      slug,
    },
  }`;

  const blogPage = await client.fetch(
    blogPageQuery,
    { lang },
    {
      next: {
        revalidate: 60
      }
    }
  );

  return blogPage;
}

export async function getBlogPostByLang(
  lang: string,
  slug: string
): Promise<Blog> {
  const blogQuery = groq`*[_type == 'blog' && slug[$lang].current == $slug][0] {
    _id,
    title,
    shortTitle,
    slug,
    seo,
    category->{
      title,
      slug
    },
    publishedAt,
    firstContent,
    previewImage,
    contentBlocks,
    videoBlock,
    relatedArticles[]->{
      _id,
      _type,
      title,
      slug,
      publishedAt,
      parentPage->{
        slug
      }
    },
    language,
    "_translations": *[_type == "translation.metadata" && references(select(^._id in path("drafts.**") => string::split(^._id, "drafts.")[1], ^._id))].translations[].value->{
      slug,
    },
  }`;

  const blog = await client.fetch(
    blogQuery,
    { lang, slug },
    {
      next: {
        revalidate: 60
      }
    }
  );

  return blog;
}

export async function getFourPostsByLang(
  lang: string,
  currentPostId: string
): Promise<Blog[]> {
  const blogPostsQuery = groq`*[_type == "blog" && language == $lang && _id != $currentPostId] | order(publishedAt desc)[0...4] {
    _id,
    title,
    slug,
    previewImage,
    category->{
      title,
      slug
    },
    publishedAt,
    language,
    "_translations": *[_type == "translation.metadata" && references(select(^._id in path("drafts.**") => string::split(^._id, "drafts.")[1], ^._id))].translations[].value->{
      slug,
    },
  }`;

  const blogPosts = await client.fetch(
    blogPostsQuery,
    { lang, currentPostId },
    {
      next: {
        revalidate: 60
      }
    }
  );

  return blogPosts;
}

export async function getNinePostsByLang(
  lang: string
  // currentPostId: string
): Promise<Blog[]> {
  const blogPostsQuery = groq`*[_type == 'blog' && language == $lang] | order(publishedAt desc)[0...9] {
    _id,
    title,
    slug,
    previewImage,
    category->{
      title,
      slug
    },
    publishedAt,
    language,
    "_translations": *[_type == "translation.metadata" && references(select(^._id in path("drafts.**") => string::split(^._id, "drafts.")[1], ^._id))].translations[].value->{
      slug,
    },
  }`;

  const blogPosts = await client.fetch(
    blogPostsQuery,
    { lang },
    {
      next: {
        revalidate: 60
      }
    }
  );

  return blogPosts;
}

export async function getBlogPostsByLang(lang: string): Promise<Blog[]> {
  const blogPostsQuery = groq`*[_type == 'blog' && language == $lang] | order(publishedAt desc) {
    _id,
    title,
    slug,
    previewImage,
    category->{
      title,
      slug
    },
    publishedAt,
    language,
    "_translations": *[_type == "translation.metadata" && references(select(^._id in path("drafts.**") => string::split(^._id, "drafts.")[1], ^._id))].translations[].value->{
      slug,
    },
  }`;

  const blogPosts = await client.fetch(
    blogPostsQuery,
    { lang },
    {
      next: {
        revalidate: 60
      }
    }
  );

  return blogPosts;
}

export async function getBlogPostsByLangWithPagination(
  lang: string,
  limit: number,
  offset: number
): Promise<Blog[]> {
  const blogPostsQuery = groq`
    *[_type == "blog" && language == $lang] | order(publishedAt desc)[$offset...$offset + $limit] {
      _id,
      title,
      slug,
      previewImage,
      category->{
        title,
        slug
      },
      publishedAt,
      language,
      "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
        slug,
      },
    }
  `;

  const blogPosts = await client.fetch(
    blogPostsQuery,
    { lang, limit, offset },
    {
      next: {
        revalidate: 60
      }
    }
  );

  return blogPosts;
}

// Новый запрос для подсчета общего количества постов
export async function getTotalBlogPostsByLang(lang: string): Promise<number> {
  const totalPostsQuery = groq`count(*[_type == "blog" && language == $lang])`;
  const total = await client.fetch(totalPostsQuery, { lang });
  return total;
}

export async function getHeaderByLang(lang: string): Promise<Header> {
  const headerQuery = groq`*[_type == 'header' && language == $lang][0] {
    _id,
    logo,
    logoMobile,
    logoMobileActive,
    description,
    navLinks,
    contactLinks,
    workingHours,
    phoneNumber,
    languageIcon,
    languageLink,
  }`;

  const header = await client.fetch(headerQuery, { lang });

  return header;
}

export async function getFooterByLang(lang: string): Promise<Footer> {
  const footerQuery = groq`*[_type == 'footer' && language == $lang][0] {
    _id,
    "consultationBlock": consultationBlock{
      title,
      titleHighlight,
      listTitle,
      list,
      giftText,
      description,
      formTitle,
      "form": form->{
        _id,
        language,
        form
      },
      buttonCustomText,
      altText,
      contactLinks
    },
    logo,
    description,
    workingHours,
    phoneNumber,
    footerEmail,
    adress,
    navLinks,
    contactLinksTitle,
    contactLinks,
    buttonText,
    copyright,
    privacyLink
  }`;

  const footer = await client.fetch(footerQuery, { lang });

  return footer;
}

export async function getHomePageByLang(lang: string): Promise<Homepage> {
  const homepageQuery = groq`*[_type == 'homepage' && language == $lang][0] {
    _id,
    title,
    seo,
    mainHeadingStart,
    mainHeadingHighlight,
    mainHeadingContinue,
    mainHeadingEnd,
    tooltip,
    description,
    descriptionSmall,
    heroButtonText,
    heroImage,
    heroDescription,
    flags,
    heroTitle,
    mainHeadingH1,
    mainHeadingH1Highlight,
    conditionsTitle,
    conditionFirst,
    conditionSecond,
    conditionThird,
    conditionFourth,
    countriesBlock,
    "quizDocumentBlock": quizDocument->quiz{
          finalTitle,
          formTitle,
          inputLabel,
          buttonText,
          questions[]{
            _key,
            questionTitle,
            useGrayStyle,
            optionsSource,
            extraOption,
            options[]{
              _key,
              label,
              value
            }
          }
        },
    universitiesBlock,
    videosTitle,
    videos,
    offerTitle,
    offerTitleHighlight,
    offerListTitle,
    offerList,
    giftText,
    offerDesctiption,
    offerFormTitle,
    "offerForm": offerForm->{
      _id,
      language,
      form
    },
    offerButtonCustomText,
    offerAltText,
    offerContactLinks,
    facultiesTitle,
    faculties,
    lastSlideTitleHighlight,
    lastSlideTitle,
    lastSlideDescription,
    "lastSlideForm": lastSlideForm->{
      _id,
      language,
      form
    },
    "survey": survey{
      title,
      // image,
      // quote,
      // description,
      // finalTitle,
      // formTitle,
      // inputLabel,
      // buttonText,
    },
    "quizBlock": quizBlock{
      finalTitle,
      formTitle,
      inputLabel,
      buttonText,
      questions[]{
        _key,
        name,
        questionTitle,
        options[]{
          _key,
          label
        }
      }
    },
    aboutSummary,
    aboutTitle,
    aboutParagraphs,
    aboutSocialsTitle,
    aboutSocials,
    aboutOffersTitle,
    aboutOffers,
    ceos,
    principlesTitle,
    principles,
    principlesTotal,
    principlesFinal,
    stepOne,
    stepTwo,
    stepThree,
    stepFour,
    extraBlock,
    priceTitle,
    priceBlock,
    faq,
    language,
    slug,
    "_translations": *[_type == "translation.metadata" && references(select(^._id in path("drafts.**") => string::split(^._id, "drafts.")[1], ^._id))].translations[].value->{
      slug,
    },
  }`;

  const homepage = await client.fetch(
    homepageQuery,
    { lang },
    {
      next: {
        revalidate: 60
      }
    }
  );

  return homepage;
}

export async function getSuccessPageByLang(lang: string): Promise<SuccessPage> {
  const successPageQuery = groq`*[_type == "successPage" && language == $lang][0] {
    _id,
    seo,
    successTextstart,
    successTextend,
    description,
    socialIcons,
    image,
    language,
    "_translations": *[_type == "translation.metadata" && references(select(^._id in path("drafts.**") => string::split(^._id, "drafts.")[1], ^._id))].translations[].value->{
      slug,
    },
  }`;

  const successPage = await client.fetch(successPageQuery, { lang });

  return successPage;
}

export async function getNotFoundPageByLang(
  lang: string
): Promise<NotFoundPage> {
  const notFoundPageQuery = groq`*[_type == "notFoundPage" && language == $lang][0] {
    _id,
    seo,
    textStart,
    textend,
    description,
    buttonText,
    image,
    language,
    "_translations": *[_type == "translation.metadata" && references(select(^._id in path("drafts.**") => string::split(^._id, "drafts.")[1], ^._id))].translations[].value->{
      slug,
    },
  }`;

  const notFoundPage = await client.fetch(notFoundPageQuery, { lang });

  return notFoundPage;
}

export async function getFormStandardDocumentByLang(
  lang: string
): Promise<FormStandardDocument> {
  const formStandardDocumentQuery = groq`*[_type == "formStandardDocument" && language == $lang][0] {
  _id,
  form,
  language
  }`;

  const formStandardDocument = await client.fetch(formStandardDocumentQuery, {
    lang
  });

  return formStandardDocument;
}

export async function getSinglePageByLang(
  lang: string,
  slug: string
): Promise<Singlepage> {
  const singlePageQuery = groq`*[_type == 'singlepage' && slug[$lang].current == $slug][0] {
    _id,
    title,
    shortTitle,
    slug,
    seo,
    coverBlock,
    previewImage,
    pageType,
    "countryCode": country->code,
    "countryTitle": country->title,
    contentBlocks[]{
      ...,
      _type == "leadMagnetBlock" => {
        ...,
        "fileUrl": file.asset->url,
        "coverUrl": coverImage.asset->url
      },
      _type == "surveyBlock" => {
        _key,
        _type,
        "quiz": survey.quizDocument->quiz{
          finalTitle,
          formTitle,
          inputLabel,
          buttonText,
          questions[]{
            _key,
            questionTitle,
            useGrayStyle,
            optionsSource,
            extraOption,
            options[]{
              _key,
              label,
              value
            }
          }
        },
        survey{
          title,
          // image,
          // quote,
          // description,

          // // это старые поля опроса (можно оставить)
          // finalTitle,
          // formTitle,
          // inputLabel,
          // buttonText,

          // ✅ и главное — quizBlock
          quizBlock{
            finalTitle,
            formTitle,
            inputLabel,
            buttonText,
            questions[]{
              _key,
              questionTitle,
              useGrayStyle,
              options[]{
                _key,
                label,
                value
              }
            }
          }
        }
      }
    },
    language,
    "_translations": *[_type == "translation.metadata" && references(select(^._id in path("drafts.**") => string::split(^._id, "drafts.")[1], ^._id))].translations[].value->{
      slug,
    },
  }`;

  const singlePage = await client.fetch(
    singlePageQuery,
    { lang, slug },
    {
      next: {
        revalidate: 60
      }
    }
  );

  return singlePage;
}

export async function getSingleSubPageBySlug(
  lang: string,
  slug: string,
  subslug: string
): Promise<Subpage | null> {
  // Ищем по паре «родитель + slug»: у страниц разных стран slug может совпадать
  // (admission-requirements есть у Грузии, Испании, Турции и Северного Кипра)
  const subPageQuery = groq`*[_type == 'subpage' && slug[$lang].current == $subslug && parentPage->slug[$lang].current == $slug][0] {
    _id,
    title,
    shortTitle,
    slug,
    seo,
    coverBlock,
    pageType,
    "countryCode": country->code,
    "countryTitle": country->title,
    contentBlocks[]{
      ...,
      _type == "leadMagnetBlock" => {
        ...,
        "fileUrl": file.asset->url,
        "coverUrl": coverImage.asset->url
      },
      _type == "surveyBlock" => {
        _key,
        _type,
        "quiz": survey.quizDocument->quiz{
          finalTitle,
          formTitle,
          inputLabel,
          buttonText,
          questions[]{
            _key,
            questionTitle,
            useGrayStyle,
            optionsSource,
            extraOption,
            options[]{
              _key,
              label,
              value
            }
          }
        },
        survey{
          title,
          // image,
          // quote,
          // description,

          // // это старые поля опроса (можно оставить)
          // finalTitle,
          // formTitle,
          // inputLabel,
          // buttonText,

          // ✅ и главное — quizBlock
          quizBlock{
            finalTitle,
            formTitle,
            inputLabel,
            buttonText,
            questions[]{
              _key,
              questionTitle,
              useGrayStyle,
              options[]{
                _key,
                label,
                value
              }
            }
          }
        }
      }
    },
    parentPage->{
      _id,
      title,
      shortTitle,
      slug
    },
    language,
    "_translations": *[_type == "translation.metadata" && references(select(^._id in path("drafts.**") => string::split(^._id, "drafts.")[1], ^._id))].translations[].value->{
      slug,
      parentPage->{
        slug
      },
    },
  }`;

  try {
    const subPage = await client.fetch(
      subPageQuery,
      { lang, slug, subslug },
      {
        next: {
          revalidate: 60
        }
      }
    );
    return subPage;
  } catch (error) {
    console.error("Error fetching subpage:", error);
    return null;
  }
}

// ✅ NEW: получаем список всех singlepage по языку (для sitemap)
export async function getSinglePagesByLang(
  lang: string
): Promise<Array<Pick<Singlepage, "slug">>> {
  const q = groq`*[
    _type == "singlepage" &&
    language == $lang &&
    !(_id in path("drafts.**"))
  ]{
    slug
  }`;

  return client.fetch(q, { lang }, { next: { revalidate: 60 } });
}

// ✅ NEW: получаем список всех subpage по языку (для sitemap)
export async function getSubPagesByLang(
  lang: string
): Promise<Array<Pick<Subpage, "slug" | "parentPage">>> {
  const q = groq`*[
    _type == "subpage" &&
    language == $lang &&
    !(_id in path("drafts.**"))
  ]{
    slug,
    parentPage->{
      slug
    }
  }`;

  return client.fetch(q, { lang }, { next: { revalidate: 60 } });
}

// ✅ NEW: страны для мега-меню, главной и страницы сравнения
export async function getCountriesByLang(lang: string): Promise<Country[]> {
  const q = groq`*[
    _type == "country" &&
    language == $lang
  ] | order(order asc) {
    _id,
    title,
    code,
    flag,
    "flagUrl": flag.asset->url,
    order,
    isFeatured,
    shortDescription,
    comparison,
    hubPage->{
      _type,
      slug
    },
    menuLinks[]{
      _key,
      label,
      page->{
        _type,
        slug,
        parentPage->{
          slug
        }
      }
    }
  }`;

  const countries = await client.fetch(q, { lang }, { next: { revalidate: 60 } });

  if (!countries) return [];

  return countries.map((country: any) => ({
    _id: country._id,
    title: country.title,
    code: country.code,
    flag: country.flag,
    flagUrl: country.flagUrl,
    order: country.order,
    isFeatured: country.isFeatured,
    shortDescription: country.shortDescription,
    comparison: country.comparison,
    hubHref: pageHref(lang, country.hubPage),
    menuLinks: (country.menuLinks || [])
      .map((item: any) => ({
        _key: item._key,
        label: item.label,
        href: pageHref(lang, item.page)
      }))
      .filter((item: any) => item.label && item.href)
  }));
}

// ✅ NEW: университеты страны (блок «Похожие университеты», списки на хабе)
export async function getUniversitiesByLang(
  lang: string,
  countryCode?: string
): Promise<University[]> {
  const q = groq`*[
    _type == "university" &&
    language == $lang
    ${countryCode ? "&& country->code == $countryCode" : ""}
  ] | order(order asc) {
    _id,
    title,
    titleLocal,
    city,
    type,
    logo,
    "logoUrl": logo.asset->url,
    tuitionFrom,
    programsLanguage,
    highlight,
    order,
    "countryCode": country->code,
    "countryTitle": country->title,
    "pageId": page->_id,
    page->{
      _type,
      slug,
      parentPage->{
        slug
      }
    }
  }`;

  // countryCode в params только когда он есть: undefined уходит строкой "undefined"
  const universities = await client.fetch(
    q,
    countryCode ? { lang, countryCode } : { lang },
    { next: { revalidate: 60 } }
  );

  if (!universities) return [];

  return universities.map((university: any) => ({
    ...university,
    href: pageHref(lang, university.page)
  }));
}

// ✅ NEW: список стран для вопроса квиза «куда хотите поехать»
export async function getCountryNamesByLang(lang: string): Promise<string[]> {
  const q = groq`*[
    _type == "country" &&
    language == $lang
  ] | order(order asc).title`;

  const names = await client.fetch(q, { lang }, { next: { revalidate: 60 } });

  return (names || []).filter(Boolean);
}

type SitemapEntry = {
  slug: any;
  _updatedAt: string;
  parentPage?: { slug: any } | null;
  _translations?: Array<{ slug: any; parentPage?: { slug: any } | null }>;
};

const TRANSLATIONS_PROJECTION = groq`*[
  _type == "translation.metadata" &&
  references(select(^._id in path("drafts.**") => string::split(^._id, "drafts.")[1], ^._id))
].translations[].value->{
  slug,
  parentPage->{ slug }
}`;

/**
 * Страницы для sitemap: свой слаг, дата обновления и слаги языковых версий —
 * из них собираются hreflang-альтернативы прямо в карте сайта.
 */
export async function getPagesForSitemap(
  type: "singlepage" | "subpage",
  lang: string
): Promise<SitemapEntry[]> {
  const q = groq`*[
    _type == $type &&
    language == $lang &&
    !(_id in path("drafts.**"))
  ]{
    slug,
    _updatedAt,
    parentPage->{ slug },
    "_translations": ${TRANSLATIONS_PROJECTION}
  }`;

  const pages = await client.fetch(
    q,
    { type, lang },
    { next: { revalidate: 60 } }
  );

  return pages || [];
}

/** Посты блога для sitemap — с датой обновления и языковыми версиями */
export async function getBlogPostsForSitemap(
  lang: string
): Promise<SitemapEntry[]> {
  const q = groq`*[
    _type == "blog" &&
    language == $lang &&
    !(_id in path("drafts.**"))
  ]{
    slug,
    _updatedAt,
    "_translations": ${TRANSLATIONS_PROJECTION}
  }`;

  const posts = await client.fetch(q, { lang }, { next: { revalidate: 60 } });

  return posts || [];
}
