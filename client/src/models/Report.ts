type Article = {
  id: number;
  title: string;
  ischecked: boolean;
};

type UserReport = {
  id: number;
  title: string;
  content: string;
  createdat: Date;
  updatedat: Date;
  useremail: string;
};

type ClientReport = {
  id: number;
  title: string;
  content: string;
  createdat: Date;
  updatedat: Date;
  clientid: number;
};

export type { Article, UserReport, ClientReport };
