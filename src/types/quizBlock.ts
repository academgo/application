// types/quizBlock.ts
export type QuizOption = {
  _key: string;
  label: string;
};

export type QuizQuestion = {
  _key: string;
  name: string; // stable field key for Formik
  questionTitle: string;
  options: QuizOption[];
};

export type QuizBlock = {
  finalTitle: string;
  formTitle: string;
  inputLabel: string;
  buttonText: string;
  questions: QuizQuestion[];
};
