# Walkthrough: SEO Optimization & Video Pages

This document outlines the recent updates focused on enhancing SEO capabilities and improved structure for video content on Onwalk Notes.

## 1. Video Route Restructuring

To strictly follow RESTful conventions and improve URL predictability, the video detail route has been renamed.

-   **Old Route**: `/video/[slug]`
-   **New Route**: `/videos/[slug]`
-   **Impact**:
    -   All internal links updated to point to `/videos/...`.
    -   Directory structure moved from `src/app/video` to `src/app/videos`.
    -   `sitemap.ts` updated to generate correct URLs.

## 2. SEO Enhancements

### 2.1 VideoObject JSON-LD Schema
We implemented structured data for video pages to improve visibility in Google Video Search.

-   **Implementation**: A `VideoObject` schema is legally injected into the `<head>` of `/videos/[slug]` pages.
-   **Data Points**:
    -   `name`: Video Title
    -   `description`: Video Description
    -   `thumbnailUrl`: Poster image URL
    -   `uploadDate`: Creation date
    -   `contentUrl`: Direct link to the video file
    -   `embedUrl`: Semantic embed URL (mapped to the page URL itself for this implementation)

### 2.2 BreadcrumbList JSON-LD
To help search engines understand the site structure, we added `BreadcrumbList` structured data.

-   **Component**: `src/components/BreadcrumbJsonLd.tsx`
-   **Usage**: Automatically generates the breadcrumb trail based on the current path (e.g., `Home > Videos > [Video Name]`).

### 2.3 Canonical URLs
Explicit self-referencing canonical URLs were added to major pages to prevent duplicate content issues.

-   **Files Affected**:
    -   `src/app/page.tsx` (Home)
    -   `src/app/videos/page.tsx` (Video Listing)
    -   `src/app/videos/[slug]/page.tsx` (Video Detail)
    -   `src/app/images/page.tsx` (Image Listing)
    -   `src/app/blogs/page.tsx` (Blog Listing)

## 3. Navigation Improvements

We enhanced the user experience for browsing media collections.

-   **Next/Previous Navigation**: Added to `MediaDetailModal` and `BlogReadingModal`.
-   **Keyboard Support**: Users can navigation between items using Left/Right arrow keys.
-   **Logic**: The parent components (`VideoGrid`, `ImagesGallery`) now pass the current sorted list context to the modals, ensuring navigation follows the user's selected sort order (Latest, Location, Views).

## 4. Technical Configuration Updates

### 4.1 Sitemap Generation (`sitemap.ts`)
-   Updated to include the new `/videos` routes.
-   Ensures `lastModified` dates are accurate.

### 4.2 Robots.txt (`robots.ts`)
-   Consolidated generation logic.
-   Explicitly points to the sitemap URL (`https://portal.onwalk.net/sitemap.xml`).

### 4.3 Cleanups
-   Resolved Next.js configuration warnings.
-   Optimized imports and removed stale code related to the old route structure.
