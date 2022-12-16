import axios from 'axios'
import { Command, Option } from 'commander'
import UserAgent from 'user-agents'
import fs from 'node:fs/promises'
import parseFonts from './parseFonts'

import { bin, description, version } from '../package.json'
import downloadFont from './downloadFont'
import writeCSS from './writeCSS'
import writeVE from './writeVE'

export interface Options {
  output: 'css' | 'vanilla-extract'
  outputDir: string
  uaFilter: string[]
  urlPrefix?: string
}

const program = new Command()

program
  .name(Object.keys(bin)[0])
  .description(description)
  .version(version)
  .arguments('<url>')
  .addOption(
    new Option(
      '--ua-filter <regexes...>',
      'regex filters for `user-agents` package',
    ).default(['Macintosh', 'Chrome']),
  )
  .addOption(
    new Option('--output <type>', 'font face file type').choices([
      'css',
      'vanilla-extract',
    ]),
  )
  .addOption(
    new Option(
      '--output-dir <path>',
      'output directory for the downloaded fonts',
    ).default('fonts'),
  )
  .addOption(new Option('--url-prefix <path>', 'prefix for the font file URLs'))
  .action(async (url: string, options: Options) => {
    const agent = new UserAgent(
      options.uaFilter.map(regex => new RegExp(regex)),
    )

    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': agent.toString(),
      },
    })

    await fs.mkdir(options.outputDir, { recursive: true })

    const fonts = parseFonts(data)
    const downloads = fonts
      .flatMap(font => font.srcurls)
      .map(srcurl => downloadFont(srcurl, options.outputDir))

    await Promise.all(downloads)

    if (options.output === 'vanilla-extract') {
      await writeVE(fonts, options)
    } else {
      await writeCSS(fonts, options)
    }
  })

export default program
