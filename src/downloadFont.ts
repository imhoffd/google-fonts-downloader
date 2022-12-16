import axios from 'axios'
import fs from 'node:fs/promises'
import path from 'node:path'

import { FontSrcUrl } from './Font'

export default async function downloadFont(
  { url, filename }: FontSrcUrl,
  outputDir: string,
): Promise<void> {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
  })

  const filePath = path.join(outputDir, filename)
  await fs.writeFile(filePath, response.data)
  console.log(`wrote '${filePath}'`)
}
