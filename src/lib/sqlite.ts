import { execFile } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execFileAsync = promisify(execFile)

const DB_PATH = path.join(
  process.cwd(),
  'prisma',
  'dev.db'
)

export function sqlString(value: unknown) {
  return `'${String(value ?? '').replace(/'/g, "''")}'`
}

async function runSqlite(args: string[]) {
  return execFileAsync(
    'sqlite3',
    args,
    {
      maxBuffer: 10 * 1024 * 1024,
    }
  )
}

export async function query<T = any>(
  sql: string
): Promise<T[]> {
  const { stdout } = await runSqlite([
    '-json',
    '-readonly',
    DB_PATH,
    sql,
  ])

  const text = stdout.trim()

  if (!text) {
    return []
  }

  try {
    const parsed = JSON.parse(text)

    return Array.isArray(parsed)
      ? parsed
      : []
  } catch (error) {
    console.error('SQLITE JSON ERROR:', error)
    console.error('SQLITE OUTPUT:', JSON.stringify(text))
    console.error('SQLITE QUERY:', sql)

    throw error
  }
}

export async function execute(
  sql: string
) {
  await runSqlite([
    DB_PATH,
    sql,
  ])
}
