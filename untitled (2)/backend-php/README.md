# 🚀 راهنمای جامع راه‌اندازی بک‌اند PHP و دیتابیس MySQL (AssetChain)

این پوشه شامل تمامی فایل‌های **بک‌اند PHP** و **پایگاه داده (MySQL)** پروژه AssetChain است تا بتوانید آن را روی هر هاست واقعی (cPanel، DirectAdmin، Plesk یا سرور اختصاصی/مجازی Ubuntu با Nginx/Apache) یا لوکال‌هاست (XAMPP / WAMP) اجرا کنید.

---

## 📁 ساختار پوشه بک‌اند PHP

```
backend-php/
├── database.sql       # فایل کامل جداول و دیتابیس MySQL + داده‌های اولیه
├── config.php         # تنظیمات اتصال به دیتابیس و هدرهای CORS
├── db.php             # کلاس اتصال PDO به دیتابیس
├── .htaccess          # تنظیمات آدرس‌دهی (Rewrite) برای سرورهای Apache
└── api/
    ├── assets.php     # وب‌سرویس دریافت لیست دارایی‌ها و جزئیات دارایی
    ├── auth.php       # وب‌سرویس ورود و ثبت‌نام کاربران
    ├── user.php       # وب‌سرویس پروفایل، موجودی کیف‌پول و دارایی‌های کاربر
    └── trades.php     # وب‌سرویس خرید و فروش سهم دارایی‌ها
```

---

## 🛠️ مراحل پله به پله راه‌اندازی روی هاست (cPanel / DirectAdmin / XAMPP)

### گام ۱: ساخت پایگاه داده در phpMyAdmin
1. وارد کنترل‌پای هاست خود (مثلاً cPanel) شوید و به بخش **MySQL® Databases** بروید.
2. یک دیتابیس جدید به نام دلخواه (مثلاً `assetchain_db`) بسازید.
3. یک کاربر جدید (User) بسازید و رمز عبور قوی برای آن انتخاب کنید.
4. کاربر را به دیتابیس متصل کرده و تمام دسترسی‌ها (**ALL PRIVILEGES**) را به آن بدهید.
5. وارد برنامه **phpMyAdmin** شوید، دیتابیس ساخته شده را انتخاب کنید، وارد تب **Import** شوید و فایل `database.sql` را آپلود و **Go** را بزنید تا تمام جداول و داده‌ها ساخته شوند.

---

### گام ۲: آپلود فایل‌های PHP روی هاست
1. فایل‌های موجود در این پوشه (`config.php`, `db.php`, `api/`, `.htaccess`) را در مسیر اصلی سایت خود (پوشه `public_html` یا یک ساب‌دامین مانند `api.yourdomain.com`) آپلود کنید.
2. نسخه PHP هاست را روی **PHP 7.4 یا PHP 8.0/8.1/8.2/8.3** قرار دهید.
3. مطمئن شوید ماژول‌های `pdo_mysql` و `json` در هاست فعال هستند (به صورت دیفالت فعال می‌باشند).

---

### گام ۳: تنظیم مشخصات دیتابیس در `config.php`
فایل `config.php` را باز کنید و اطلاعات دیتابیس خود را وارد کنید:

```php
define('DB_HOST', 'localhost'); // در اکثر هاست‌ها localhost است
define('DB_NAME', 'اسم_دیتابیس_شما');
define('DB_USER', 'نام_کاربری_دیتابیس_شما');
define('DB_PASS', 'رمز_عبور_دیتابیس_شما');
define('DB_PORT', '3306');
```

---

### گام ۴: تست وب‌سرویس‌های PHP
پس از آپلود، می‌توانید آدرس‌های زیر را در مرورگر یا Postman تست کنید:

- **دریافت لیست دارایی‌ها:**
  `https://yourdomain.com/backend-php/api/assets.php`
- **دریافت دارایی با کد:**
  `https://yourdomain.com/backend-php/api/assets.php?id=FOOLAD`
- **اطلاعات پروفایل کاربر:**
  `https://yourdomain.com/backend-php/api/user.php`
- **ورود کاربر:**
  `POST https://yourdomain.com/backend-php/api/auth.php?action=login`
- **خرید سهم:**
  `POST https://yourdomain.com/backend-php/api/trades.php?action=buy`

---

## 🔗 اتصال فرانت‌اند (React) به این بک‌اند PHP

در فایل `src/lib/api.ts` پروژه React، کافیست آدرس پایه را به دامنه هاست PHP خود تغییر دهید:

```typescript
export const API_BASE = 'https://yourdomain.com/backend-php/api';
```

سپس با دستور `npm run build` پروژه فرانت‌اند را بیلد گرفته و پوشه `dist` حاصل را روی هاست آپلود کنید.
