import { RectangleImageData } from '../components/images/image-data';

export interface ArticleStackData{
    article_id: string,
    event_id: string,
    source: string,
    title: string,
    keywords?: any,
    article_type?: string,
    report_type?: string,
    article_sub_type?: string,
    category?: string,
    subcategory?: string,
    headline?: string,
    image_url: string,
    time_stamp?: string,
    article_url?: string,
    last_updated?: string,
    publication_date?: string, //replace for last_updated
    keyUrl?: any,
    author?: string,
    publisher?: string,
    teaser?: string,
    scope?: string
  }

export interface VideoStackData{
    id: string,
    time_stamp: number,
    keyword: string,
    title: string,
    video_thumbnail: string,
    embed_url?:any,
    keyUrl?: any,
    teaser?: string,
    video_url?: any,
    thumbnail_height?: string,
    thumbnail_width?: string
}

export interface SectionNameData{
  icon: string,
  title: string,
  route?: any
}
