export interface BlogPost {
  slug: string;
  title: string;
  videoId: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
  series?: string;
  part?: number;
  isDraft: boolean;
}

export class BlogPostConvert {
  public static toBlogPost(json: string): BlogPost {
    return JSON.parse(json);
  }

  public static blogPostToJson(value: BlogPost): string {
    return JSON.stringify(value);
  }
}