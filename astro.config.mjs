import { defineConfig } from "astro/config";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import codesandbox from "remark-codesandbox";
import yaml from "@rollup/plugin-yaml";
import mdx from "@astrojs/mdx";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
import { h } from "hastscript";
import react from "@astrojs/react";
import remarkHtml from "remark-html";
import remarkRehype from "remark-rehype";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toHtml } from "hast-util-to-html";
import { toHast } from "mdast-util-to-hast";

function getExperiment(name) {
  return `experiments-static/${"" + name}`;
}

/** */

/**
 * A remark plugin that converts ::: blocks into <div className="spoiler">...</div>
 */
export function remarkSpoiler() {
  return (tree) =>
    visit(tree, "paragraph", (node, index, parent) => {
      if (
        !parent ||
        !Array.isArray(node.children) ||
        node.children.length !== 1
      )
        return;

      const child = node.children[0];
      if (child.type !== "text") return;

      const value = child.value.trim();
      if (
        value.startsWith(":::") &&
        value.endsWith(":::") &&
        value.length > 6
      ) {
        const innerText = value.slice(3, -3).trim();

        const mdast = fromMarkdown(innerText);
        const hast = toHast(mdast);
        const innerHtml = toHtml(hast);

        parent.children[index] = {
          type: "html",
          value: `<details>
            <summary>Click for potential spoilers</summary>
            ${innerHtml}
          </details>`,
        };
      }
    });
}

// https://astro.build/config

// https://astro.build/config
export default defineConfig({
  // markdown: {
  //   remarkPlugins: [
  //     remarkMath,
  //     [
  //       codesandbox,
  //       {
  //         mode: "iframe",
  //         style: {
  //           height: "700px",
  //         },
  //       },
  //     ],
  //   ],
  //   rehypePlugins: [rehypeKatex],
  // },
  integrations: [
    mdx({
      remarkPlugins: [
        remarkMath,
        remarkDirective,
        remarkSpoiler,
        // [
        //   remarkSpoiler,
        //   {
        //     token: ":::",
        //     summaryClassName: ["spoiler"],
        //     detailsClassName: ["spoiler"],
        //   },
        // ],
        // [
        //   codesandbox,
        //   {
        //     mode: "iframe",
        //     style: {
        //       height: "700px",
        //     },
        //   },
        // ],
      ],
      rehypePlugins: [rehypeKatex],
      gfm: true,
      shikiConfig: {
        // Choose from Shiki's built-in themes (or add your own)
        // https://github.com/shikijs/shiki/blob/main/docs/themes.md
        theme: "nord",
        // Enable word wrap to prevent horizontal scrolling
        wrap: true,
      },
    }),
    react(),
  ],
});
