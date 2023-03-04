import { defineConfig } from "astro/config";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import codesandbox from "remark-codesandbox";
import yaml from "@rollup/plugin-yaml";

// https://astro.build/config
import mdx from "@astrojs/mdx";

// https://astro.build/config
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  vite: {
    vite: {
      plugins: [yaml()]
    }
  },
  integrations: [mdx({
    remarkPlugins: [remarkMath, [codesandbox, {
      mode: "iframe",
      style: {
        height: "700px"
      }
    }]],
    rehypePlugins: [rehypeKatex],
    gfm: true,
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: "nord",
      // Enable word wrap to prevent horizontal scrolling
      wrap: true
    }
  }), react()]
});