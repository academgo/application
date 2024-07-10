import { createClient } from 'next-sanity';

export const projectId = '19hn716s';
export const dataset = 'production';
const apiVersion = '2023-10-16';
const useCdn = process.env.NODE_ENV === 'production';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
});