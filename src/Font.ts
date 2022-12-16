export interface FontSrcUrl {
  filename: string
  url: string
  format: string
}

export default interface Font {
  family: string
  style: string
  weight: number
  srcurls: FontSrcUrl[]
  unicodeRange: string
  unicodeRangeDescription: string
  display?: string
}
