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

/** */
function myHTMLPlugin() {
  /**
   * @param {import('mdast').Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    visit(tree, function (node) {
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        const data = node.data || (node.data = {});
        const hast = h(node.name, node.attributes || {});

        data.hName = hast.tagName;
        data.hProperties = hast.properties;
      }
    });
  };
}

// https://astro.build/config

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [yaml()],
    // build: {
    //   rollupOptions: {
    //     input: {
    //       ["brick-breaker"]: getExperiment("brick-breaker"),
    //       ["maze-solver"]: getExperiment("maze-solver"),
    //       ["snake"]: getExperiment("snake"),
    //       ["sudoku"]: getExperiment("sudoku"),
    //     },
    //   },
    // },
  },
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
        myHTMLPlugin,
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
