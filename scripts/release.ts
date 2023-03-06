import { execSync } from 'child_process'

const release = async () => {
  console.log('[release] Starting release')

  execSync('pnpm run clean', { stdio: 'inherit' })
  execSync('pnpm run lint', { stdio: 'inherit' })
  execSync('pnpm run test', { stdio: 'inherit' })

  execSync('pnpm run build', { stdio: 'inherit' })

  execSync('pnpm run clean', { stdio: 'inherit' })

  execSync('bumpp -r -c "Released v%s" --no-push', { stdio: 'inherit' })

  console.log('[release] Release complete')
}

release()
  .catch((err) => {
    console.error('[build] Error:', err)
    process.exit(1)
  })
