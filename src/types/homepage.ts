export type Homepage = {
  _type: 'homepage';
  _id: string;
  _rev: string;
  title: string;
  description: string;
  language: string;
  slug: {
    [lang: string]: {
      current: string;
    };
  };
  _translations: [
    {
      slug: {
        [lang: string]: {
          current: string;
        };
      };
    },
  ];
}