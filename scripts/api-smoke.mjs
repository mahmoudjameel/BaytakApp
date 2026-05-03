#!/usr/bin/env node
/**
 * فحص شامل لـ API بايتك: اتصال، فئات عامة، تسجيل دخول، ملف شخصي، فئات مع توكن.
 *
 * الاستخدام:
 *   node scripts/api-smoke.mjs
 *   API_BASE=https://api.example.com node scripts/api-smoke.mjs
 *
 * لاختبار مستخدمين حقيقيين انسخ scripts/api-test-users.example.json إلى
 * scripts/api-test-users.json وأضف البريد وكلمة المرور (لا ترفع الملف للـ git).
 */

import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.API_BASE || 'https://api.abdallah-ghazal.cloud';

async function http(method, pathname, { json, token } = {}) {
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${pathname}`, {
    method,
    headers,
    body: json !== undefined ? JSON.stringify(json) : undefined,
  });
  const text = await res.text();
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }
  return { ok: res.ok, status: res.status, body };
}

function section(title) {
  console.log(`\n━━ ${title} ━━`);
}

function pass(msg) {
  console.log(`  [OK] ${msg}`);
}

function fail(msg, extra) {
  console.log(`  [!!] ${msg}`);
  if (extra !== undefined) console.log('      ', typeof extra === 'string' ? extra : JSON.stringify(extra).slice(0, 500));
}

async function main() {
  console.log(`\nBaytak API smoke test\nBase URL: ${BASE}\n`);

  section('Root');
  {
    const r = await http('GET', '/');
    if (r.ok || r.status < 500) pass(`GET / → ${r.status}`);
    else fail('GET / failed', r.body);
  }

  section('Categories (no token)');
  {
    const r = await http('GET', '/categories?limit=5');
    if (r.status === 401) {
      fail('GET /categories بدون توكن → 401 (يمنع عرض الخدمات قبل التسجيل كمزوّد)');
    } else if (r.ok) {
      const n = Array.isArray(r.body?.data) ? r.body.data.length : Array.isArray(r.body) ? r.body.length : '?';
      pass(`GET /categories عام → ${r.status}, عناصر≈${n}`);
    } else {
      fail(`GET /categories → ${r.status}`, r.body);
    }
  }

  section('Sign-in (invalid credentials)');
  {
    const r = await http('POST', '/auth/mobile/sign-in', {
      json: { email: '__smoke_invalid__@invalid.local', password: 'wrongwrong99' },
    });
    if (r.status === 401 || r.status === 400 || r.status === 404) {
      pass(`رفض بيانات خاطئة كما متوقع → ${r.status}`);
    } else {
      fail('استجابة غير متوقعة لبيانات خاطئة', r.status);
    }
  }

  const usersPath = join(__dirname, 'api-test-users.json');
  let accounts = [];
  if (fs.existsSync(usersPath)) {
    try {
      accounts = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
      if (!Array.isArray(accounts)) accounts = [];
    } catch (e) {
      fail('تعذر قراءة api-test-users.json', String(e));
    }
  }

  if (accounts.length === 0) {
    section('حسابات اختبار');
    console.log('  (تخطي) أنشئ ملف scripts/api-test-users.json من المثال لاختبار تسجيل دخول حقيقي.');
  }

  for (const acc of accounts) {
    const label = acc.label || acc.email;
    section(`User: ${label}`);
    const r = await http('POST', '/auth/mobile/sign-in', {
      json: { email: acc.email, password: acc.password },
    });
    const token = r.body?.accessToken;
    if (!r.ok || !token) {
      fail('تسجيل الدخول فشل', { status: r.status, body: r.body });
      continue;
    }
    pass('تسجيل الدخول نجح (accessToken موجود)');

    const profilePaths = ['/users/me', '/profile/me', '/providers/me'];
    let p = { ok: false, status: 0, body: null };
    for (const path of profilePaths) {
      p = await http('GET', path, { token });
      if (p.ok) {
        pass(`GET ${path} → role=${p.body?.role ?? p.body?.data?.role ?? '?'} email=${p.body?.email ?? p.body?.data?.email ?? '?'}`);
        break;
      }
    }
    if (!p.ok) {
      fail('GET ملف المستخدم بعد الدخول فشل (جرّبنا /users/me و /profile/me و /providers/me)', {
        status: p.status,
        body: p.body,
      });
    }

    const c = await http('GET', '/categories?limit=5', { token });
    if (!c.ok) {
      fail('GET /categories مع التوكن فشل', c.status);
    } else {
      const list = Array.isArray(c.body?.data) ? c.body.data : Array.isArray(c.body) ? c.body : [];
      pass(`GET /categories (مع توكن) → ${list.length} فئة (تقريباً)`);
    }
  }

  console.log('\nانتهى الفحص.\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
