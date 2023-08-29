/* eslint-env jest */

import { join } from 'path'
import { nextBuild, File } from 'next-test-utils'

const appDir = join(__dirname, '..')
const configFile = new File(join(appDir, '/next.config.js'))
const configFileMjs = new File(join(appDir, '/next.config.mjs'))

describe('Config Experimental Warning', () => {
  afterEach(() => {
    configFile.write('')
    configFile.delete()
    configFileMjs.write('')
    configFileMjs.delete()
  })

  it('should not show warning with default config from function', async () => {
    configFile.write(`
      module.exports = (phase, { defaultConfig }) => {
        return {
          ...defaultConfig,
        }
      }
    `)

    const { stdout } = await nextBuild(appDir, [], { stdout: true })
    expect(stdout).not.toMatch(' - Experiments (use at your own risk):')
  })

  it('should not show warning with config from object', async () => {
    configFile.write(`
      module.exports = {
        images: {},
      }
    `)
    const { stdout } = await nextBuild(appDir, [], { stdout: true })
    expect(stdout).not.toMatch(' - Experiments (use at your own risk):')
  })

  it('should show warning with config from object with experimental', async () => {
    configFile.write(`
      module.exports = {
        experimental: {
          workerThreads: true
        }
      }
    `)
    const { stdout } = await nextBuild(appDir, [], { stdout: true })
    expect(stdout).toMatch(' - Experiments (use at your own risk):')
    expect(stdout).toMatch(' · workerThreads')
  })

  it('should show warning with config from function with experimental', async () => {
    configFile.write(`
      module.exports = (phase) => ({
        experimental: {
          workerThreads: true
        }
      })
    `)
    const { stdout } = await nextBuild(appDir, [], { stdout: true })
    expect(stdout).toMatch(' - Experiments (use at your own risk):')
    expect(stdout).toMatch(' · workerThreads')
  })

  it('should not show warning with default value', async () => {
    configFile.write(`
      module.exports = (phase) => ({
        experimental: {
          workerThreads: false
        }
      })
    `)
    const { stdout } = await nextBuild(appDir, [], { stdout: true })
    expect(stdout).not.toMatch(' - Experiments (use at your own risk):')
    expect(stdout).not.toMatch(' · workerThreads')
  })

  it('should show warning with config from object with experimental and multiple keys', async () => {
    configFile.write(`
      module.exports = {
        experimental: {
          urlImports: true,
          workerThreads: true,
        }
      }
    `)
    const { stdout } = await nextBuild(appDir, [], { stdout: true })
    expect(stdout).not.toMatch(' - Experiments (use at your own risk):')
    expect(stdout).not.toMatch(' · urlImports')
    expect(stdout).not.toMatch(' · workerThreads')
  })
})
