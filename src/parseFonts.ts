import type css from 'css'
import { __, find, kebabCase, trimChars } from 'lodash/fp'
import path from 'node:path'

import type { FontSrcUrl } from './Font'
import type Font from './Font'
import parseStylesheet from './parseStylesheet'

const isComment = (rule: css.Node): rule is css.Comment =>
  rule.type === 'comment'

const isFontFaceRule = (rule: css.Node): rule is css.Rule =>
  rule.type === 'font-face'

const isDeclaration = (declaration: css.Node): declaration is css.Declaration =>
  declaration.type === 'declaration'

const byProperty = (property: string) => (declaration: css.Declaration) =>
  declaration.property === property

const trimQuotes = trimChars(`'"`)

export default function parseFonts(stylesheet: string): Font[] {
  const parsedStylesheet = parseStylesheet(stylesheet)
  const fonts: Font[] = []

  for (const [i, rule] of Object.entries(parsedStylesheet.rules)) {
    if (isFontFaceRule(rule)) {
      const previousNode = parsedStylesheet.rules[Number(i) - 1]

      if (!isComment(previousNode) || !previousNode.comment) {
        throw new Error('Missing comment before font-face rule')
      }

      const declarations = rule.declarations?.filter(isDeclaration)

      if (!declarations) {
        throw new Error('Rule has no declarations')
      }

      const findDeclaration = find(__, declarations)
      const fontFamilyDeclaration = findDeclaration(byProperty('font-family'))
      const fontStyleDeclaration = findDeclaration(byProperty('font-style'))
      const fontDisplayDeclaration = findDeclaration(byProperty('font-display'))
      const fontWeightDeclaration = findDeclaration(byProperty('font-weight'))
      const srcDeclaration = findDeclaration(byProperty('src'))
      const unicodeRangeDeclaration = findDeclaration(
        byProperty('unicode-range'),
      )

      if (
        !fontFamilyDeclaration?.value ||
        !fontStyleDeclaration?.value ||
        !fontWeightDeclaration?.value ||
        !srcDeclaration?.value ||
        !unicodeRangeDeclaration?.value
      ) {
        throw new Error('Misshapened font-face rule')
      }

      const unicodeRangeDescription = previousNode.comment.trim()

      const fontName = kebabCase(
        [
          fontFamilyDeclaration.value,
          fontWeightDeclaration.value,
          fontStyleDeclaration.value,
          unicodeRangeDescription,
        ].join('-'),
      )

      const family = trimQuotes(fontFamilyDeclaration.value)
      const style = fontStyleDeclaration.value
      const weight = Number(fontWeightDeclaration.value)
      const unicodeRange = unicodeRangeDeclaration.value
      const srcurls: FontSrcUrl[] = []

      for (const src of srcDeclaration.value.split(',')) {
        const match = src.match(/url\((?<url>.*)\)\s+format\('(?<format>.*)'\)/)

        if (!match?.groups?.url || !match?.groups?.format) {
          throw new Error('Misshapened src declaration')
        }

        const { url, format } = match.groups

        const ext = path.extname(url)

        srcurls.push({
          filename: `${fontName}${ext}`,
          url,
          format,
        })
      }

      fonts.push({
        family,
        style,
        weight,
        srcurls,
        unicodeRange,
        unicodeRangeDescription,
        display: fontDisplayDeclaration?.value,
      })
    }
  }

  return fonts
}
