import css from 'css'

export default function parseStylesheet(stylesheet: string): css.StyleRules {
  const result = css.parse(stylesheet)

  if (!result.stylesheet) {
    throw new Error('Error parsing stylesheet')
  }

  return result.stylesheet
}
