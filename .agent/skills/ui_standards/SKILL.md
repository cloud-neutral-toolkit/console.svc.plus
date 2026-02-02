---
name: UI Design Standards
description: Rules and guidelines for consistent UI components including dropdowns, popovers, and list items.
---

# UI Design Standards

This skill provides guidelines for building consistent, accessible, and high-quality UI components within the codebase.

## 1. Popovers and Dropdowns (弹窗与下拉规范)

### Alignment (定位逻辑)
- **Right Edge Alignment**: For triggers located on the right side of the screen or navigation bar, the associated dropdown/popover MUST be right-aligned with the trigger.
  - In Radix UI / shadcn: Use `align="end"`.
  - In CSS/Tailwind: Use `absolute right-0`.
- **Vertical Spacing**: Maintain a consistent vertical offset from the trigger, typically `8px` (`mt-2` or `sideOffset={8}`).

### Layering and Visual Hierarchy (层级管理)
- **Z-Index**: Always explicitly declare a `z-index` of `50` or higher for floating UI elements to ensure they appear above all other content.
- **Background Integrity**: Drodown containers should use opaque background colors (e.g., `bg-white` or theme-defined `bg-surface`) to prevent "see-through" visual noise from underlying content. Avoid excessive transparency/blur if it compromises readability.
- **Shadows**: Use distinct shadows (e.g., `shadow-md` or `shadow-xl`) to provide depth.

### Clipping Prevention (溢出处理)
- Use Portals (e.g., `DropdownMenu.Portal`) to render floating content into the `document.body`. This prevents the menu from being clipped by parents with `overflow: hidden`.

## 2. List Items and Components (列表项规范)

### Layout and Alignment (对齐规范)
- **Flexbox**: Use `flex items-center` for all list items that include both an icon and a text label.
- **Icon Spacing**: Maintain a standard horizontal gap between icons and labels (recommended: `gap-3` or `12px`).

### Component Integrity (防压缩与自适应)
- **Icon Shrinking**: Icons within flex containers MUST have `flex-shrink: 0` (Tailwind: `shrink-0`) to prevent them from distorting when the container is narrow.
- **Minimum Width**: Containers displaying variable-length text (like user emails) should have a reasonable `min-width` (e.g., `min-w-[200px]`) to ensure comfortable display.

## 3. Interaction and Accessibility

- **Keyboard Support**: Ensure dropdowns support `Esc` to close and allow keyboard navigation (Tab/Arrows).
- **Outside Clicks**: Implement "click outside to close" logic for all popovers.
- **Motion**: Use subtle entry/exit animations (e.g., 120ms fade and scale). Respect `prefers-reduced-motion`.
