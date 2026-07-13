export const blogCategories = ['guide', 'roadmap'] as const;

export type BlogCategory = (typeof blogCategories)[number];

export const blogCategoryLabels: Record<BlogCategory, string> = {
  guide: 'Guide',
  roadmap: 'Roadmap'
};

export function isPublishedBlogEntry(entry: { data: { draft?: boolean } }): boolean {
  return entry.data.draft !== true;
}

export function sortBlogEntries<T extends { data: { pubDate: Date } }>(
  entries: readonly T[]
): T[] {
  return [...entries].sort(
    (left, right) => right.data.pubDate.valueOf() - left.data.pubDate.valueOf()
  );
}
