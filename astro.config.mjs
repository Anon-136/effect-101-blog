import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import astroExpressiveCode from "astro-expressive-code"
import ecTwoSlash from "expressive-code-twoslash"
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers"
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections"

export default defineConfig({
  integrations: [
    astroExpressiveCode({
      themes: ["github-light", "github-dark"],
      plugins: [
        pluginLineNumbers(),
        pluginCollapsibleSections(),
        ecTwoSlash({
          includeJsDoc: true,
          allowNonStandardJsDocTags: true,
          instanceConfigs: {
            twoslash: {
              explicitTrigger: true,
              languages: ["ts", "tsx"],
            },
          },
        }),
      ],
    }),
    mdx(),
  ],
})
