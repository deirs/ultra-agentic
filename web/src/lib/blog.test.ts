import { describe, expect, test } from 'bun:test';

import {
  blogCategories,
  blogCategoryLabels,
  isPublishedBlogEntry,
  sortBlogEntries
} from './blog';

describe('blogCategories', () => {
  test('exposes guide and roadmap', () => {
    expect(blogCategories).toEqual(['guide', 'roadmap']);
    expect(blogCategoryLabels.guide).toBe('Guide');
    expect(blogCategoryLabels.roadmap).toBe('Roadmap');
  });
});

describe('isPublishedBlogEntry', () => {
  test('treats missing or false draft as published', () => {
    expect(isPublishedBlogEntry({ data: {} })).toBe(true);
    expect(isPublishedBlogEntry({ data: { draft: false } })).toBe(true);
  });

  test('excludes draft true', () => {
    expect(isPublishedBlogEntry({ data: { draft: true } })).toBe(false);
  });
});

describe('sortBlogEntries', () => {
  test('orders by pubDate descending', () => {
    const entries = [
      { id: 'older', data: { pubDate: new Date('2026-06-01') } },
      { id: 'newer', data: { pubDate: new Date('2026-07-01') } },
      { id: 'mid', data: { pubDate: new Date('2026-06-15') } }
    ];

    expect(sortBlogEntries(entries).map((entry) => entry.id)).toEqual([
      'newer',
      'mid',
      'older'
    ]);
  });
});
