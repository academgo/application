import { groq } from "next-sanity";
import { client } from "./sanity.client";
import { Post } from "@/types/post";
import { Header } from "@/types/header";
import { Homepage } from "@/types/homepage";

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

export async function getHomePageByLang(lang: string): Promise<Homepage> {
  const homepageQuery = groq`*[_type == 'homepage' && language == $lang][0] {
    _id,
    title,
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
    language,
    slug,
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      slug,
    },
  }`;

  const homepage = await client.fetch(homepageQuery, { lang });

  return homepage;
}
