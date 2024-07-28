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
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
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
      title,
      slug,
      publishedAt
    },
    language,
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
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
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
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
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
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
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
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
    conditionsTitle,
    conditionFirst,
    conditionSecond,
    conditionThird,
    conditionFourth,
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
      image,
      quote,
      description,
      finalTitle,
      formTitle,
      inputLabel,
      buttonText,
    },
    aboutSummary,
    aboutTitle,
    aboutParagraphs,
    sertificateLink,
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
    language,
    slug,
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
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
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
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
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
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
