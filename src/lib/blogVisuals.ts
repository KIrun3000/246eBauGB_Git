export interface BlogImageRecord {
  fileName: string;
  alt: string;
  caption: string;
  schemaImages?: string[];
}

export interface BlogVisual {
  src: string;
  srcSet: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  schemaImages?: string[];
}

export const getBlogVisual = (image: BlogImageRecord): BlogVisual => ({
  src: `/images/blog/${image.fileName}.webp`,
  srcSet: `/images/blog/${image.fileName}-768.webp 768w, /images/blog/${image.fileName}.webp 1536w`,
  alt: image.alt,
  caption: image.caption,
  width: 1536,
  height: 864,
  schemaImages: image.schemaImages?.map((fileName) => `/images/blog/${fileName}.webp`),
});
