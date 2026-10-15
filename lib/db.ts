import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import seed from '../seed/seed.json';

export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');

/** Editable columns per table – also the allow-list for the admin API. */
export const TABLES = {
  categories: ['name', 'slug', 'description', 'cover', 'sort'],
  designs: ['name', 'slug', 'category_id', 'description', 'image', 'thumb', 'extra_images', 'price', 'starting', 'duration', 'featured'],
  packages: ['name', 'description', 'price', 'starting', 'features', 'sort'],
  testimonials: ['name', 'location', 'text', 'sort'],
  enquiries: ['status', 'quote_price', 'quote_notes'], // updatable only
} as const;
export type TableName = keyof typeof TABLES;

export type DBStatement = {
  all: (...params: any[]) => any[];
  get: (...params: any[]) => any | undefined;
  run: (...params: any[]) => { changes: number; lastInsertRowid: number | bigint };
};

export type DBInstance = {
  exec: (sql: string) => void;
  prepare: (sql: string) => DBStatement;
  pragma: (sql: string) => void;
  transaction: <T extends (...args: any[]) => any>(fn: T) => T;
};

const g = globalThis as unknown as { _db?: DBInstance };

export function db(): DBInstance {
  if (g._db) return g._db;
  fs.mkdirSync(path.join(DATA_DIR, 'uploads'), { recursive: true });
  // @ts-expect-error - node:sqlite types may not be present in @types/node v20
  const rawDb = new DatabaseSync(path.join(DATA_DIR, 'mehndi.db'));

  const d: DBInstance = {
    exec: (sql: string) => rawDb.exec(sql),
    prepare: (sql: string) => rawDb.prepare(sql) as unknown as DBStatement,
    pragma: (p: string) => rawDb.exec(`PRAGMA ${p}`),
    transaction: <T extends (...args: any[]) => any>(fn: T): T => {
      return ((...args: any[]) => {
        rawDb.exec('BEGIN');
        try {
          const res = fn(...args);
          rawDb.exec('COMMIT');
          return res;
        } catch (err) {
          rawDb.exec('ROLLBACK');
          throw err;
        }
      }) as T;
    },
  };

  d.pragma('journal_mode = WAL');
  d.exec(`
  CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL DEFAULT '');
  CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY, name TEXT, slug TEXT UNIQUE, description TEXT DEFAULT '', cover TEXT DEFAULT '', sort INTEGER DEFAULT 0);
  CREATE TABLE IF NOT EXISTS designs (id INTEGER PRIMARY KEY, name TEXT, slug TEXT UNIQUE, category_id INTEGER, description TEXT DEFAULT '', image TEXT DEFAULT '', thumb TEXT DEFAULT '', extra_images TEXT DEFAULT '', price INTEGER DEFAULT 0, starting INTEGER DEFAULT 1, duration TEXT DEFAULT '', featured INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS packages (id INTEGER PRIMARY KEY, name TEXT, description TEXT DEFAULT '', price INTEGER DEFAULT 0, starting INTEGER DEFAULT 1, features TEXT DEFAULT '', sort INTEGER DEFAULT 0);
  CREATE TABLE IF NOT EXISTS testimonials (id INTEGER PRIMARY KEY, name TEXT, location TEXT DEFAULT '', text TEXT, sort INTEGER DEFAULT 0);
  CREATE TABLE IF NOT EXISTS enquiries (id INTEGER PRIMARY KEY, name TEXT, phone TEXT, category TEXT, design TEXT, event_date TEXT, location TEXT, time_pref TEXT, notes TEXT, status TEXT DEFAULT 'new', quote_price INTEGER, quote_notes TEXT DEFAULT '', created_at TEXT DEFAULT CURRENT_TIMESTAMP);
  `);
  if (!d.prepare('SELECT 1 FROM categories LIMIT 1').get()) {
    const ins = (t: string, rows: Record<string, unknown>[]) => {
      for (const r of rows) {
        const k = Object.keys(r);
        d.prepare(`INSERT INTO ${t} (${k.join(',')}) VALUES (${k.map(() => '?').join(',')})`).run(...Object.values(r));
      }
    };
    d.transaction(() => {
      ins('categories', seed.categories); ins('designs', seed.designs);
      ins('packages', seed.packages); ins('testimonials', seed.testimonials);
      for (const [k, v] of Object.entries(seed.settings)) d.prepare('INSERT OR IGNORE INTO settings VALUES (?,?)').run(k, v);
    })();
  }
  g._db = d;
  return d;
}

export type Design = { id: number; name: string; slug: string; category_id: number; description: string; image: string; thumb: string; extra_images: string; price: number; starting: number; duration: string; featured: number };
export type Category = { id: number; name: string; slug: string; description: string; cover: string; sort: number };
export type Pkg = { id: number; name: string; description: string; price: number; starting: number; features: string };

export const getSettings = (): Record<string, string> =>
  Object.fromEntries((db().prepare('SELECT key,value FROM settings').all() as { key: string; value: string }[]).map((r) => [r.key, r.value]));
export const getCategories = () => db().prepare('SELECT * FROM categories ORDER BY sort,id').all() as Category[];
export const getDesigns = () => db().prepare('SELECT * FROM designs ORDER BY id').all() as Design[];
export const getDesign = (slug: string) => db().prepare('SELECT * FROM designs WHERE slug=?').get(slug) as Design | undefined;
export const getPackages = () => db().prepare('SELECT * FROM packages ORDER BY sort,id').all() as Pkg[];
export const getTestimonials = () => db().prepare('SELECT * FROM testimonials ORDER BY sort,id').all() as { id: number; name: string; location: string; text: string }[];

export function rowOp(t: TableName, op: 'insert' | 'update', data: Record<string, unknown>, id?: number) {
  const cols = TABLES[t].filter((c) => c in data);
  const vals = cols.map((c) => (data[c] === '' && ['price', 'quote_price', 'category_id'].includes(c) ? null : data[c]));
  if (op === 'insert') {
    const r = db().prepare(`INSERT INTO ${t} (${cols.join(',')}) VALUES (${cols.map(() => '?').join(',')})`).run(...vals);
    return r.lastInsertRowid;
  }
  if (cols.length) db().prepare(`UPDATE ${t} SET ${cols.map((c) => c + '=?').join(',')} WHERE id=?`).run(...vals, id);
  return id;
}
