# شركة مكة — نظام التقديم الآمن

## 🔗 الروابط بعد النشر

| الجهة      | الرابط                                      |
|------------|---------------------------------------------|
| المتقدمون  | `https://your-site.netlify.app/`            |
| الإدارة    | `https://your-site.netlify.app/admin/`      |

---

## 🚀 خطوات النشر على Netlify

### 1 — أضف المتغيرات السرية في Netlify (مرة واحدة فقط)

في لوحة Netlify → Site Settings → Environment Variables، أضف:

| المتغير         | القيمة                                     |
|-----------------|--------------------------------------------|
| `TG_TOKEN`      | توكن بوت تيليغرام الخاص بك                |
| `TG_CHATID`     | معرّف المحادثة                             |
| `ADMIN_PASSWORD`| كلمة سر الإدارة                           |

> ⚠️ لا ترفع ملف `.env` أبداً — فقط ضع القيم في لوحة Netlify.

### 2 — ارفع الملفات (Drag & Drop)

1. اذهب إلى https://app.netlify.com/drop
2. اسحب المجلد (بدون ملف `.env`)
3. تم النشر! 🎉

### 3 — أو عبر Git

```bash
git init
git add .          # .gitignore يمنع رفع .env تلقائياً
git commit -m "Initial deploy"
git remote add origin https://github.com/YOUR/REPO.git
git push -u origin main
```
ثم في Netlify: New site → Import from Git.

---

## 🛡️ الأمان

- ✅ لا توجد أسرار في كود الصفحة — كل شيء في متغيرات الخادم
- ✅ التوكن وكلمة السر تعمل فقط من خلال Netlify Functions (سيرفر)
- ✅ حماية ضد brute-force: قفل 60 ثانية بعد 5 محاولات خاطئة
- ✅ صفحة الإدارة مخفية عن محركات البحث (`noindex`)
- ✅ رؤوس أمان HTTP على جميع الصفحات
- ✅ تعقيم المدخلات على السيرفر قبل الإرسال

---

## 📁 هيكل الملفات

```
mecca-project/
├── index.html              ← صفحة المتقدمين
├── admin/
│   └── index.html          ← لوحة الإدارة
├── netlify/
│   └── functions/
│       ├── submit.js       ← إرسال تيليغرام (سيرفر)
│       └── auth.js         ← تحقق كلمة السر (سيرفر)
├── netlify.toml
├── .env                    ⛔ لا ترفعه أبداً
└── .gitignore              ← يمنع رفع .env
```
