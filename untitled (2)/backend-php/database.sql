-- ============================================================
-- AssetChain RWA Tokenization Platform - Database Schema & Seed Data
-- Database Engine: MySQL / MariaDB (utf8mb4_unicode_ci)
-- ============================================================

CREATE DATABASE IF NOT EXISTS `assetchain_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `assetchain_db`;

-- --------------------------------------------------------
-- Table structure for `assets`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `purchase_lots`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `activities`;
DROP TABLE IF EXISTS `portfolio`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `assets`;

CREATE TABLE `assets` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `enName` VARCHAR(255) NOT NULL,
  `faName` VARCHAR(255) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `price` DECIMAL(18,4) NOT NULL DEFAULT '0.0000',
  `change_pct` DECIMAL(8,2) NOT NULL DEFAULT '0.00',
  `flag` VARCHAR(10) NOT NULL DEFAULT 'ir',
  `locationEn` VARCHAR(255) DEFAULT NULL,
  `locationFa` VARCHAR(255) DEFAULT NULL,
  `progress` INT NOT NULL DEFAULT '50',
  `descriptionEn` TEXT DEFAULT NULL,
  `descriptionFa` TEXT DEFAULT NULL,
  `backingEn` TEXT DEFAULT NULL,
  `backingFa` TEXT DEFAULT NULL,
  `custodianEn` TEXT DEFAULT NULL,
  `custodianFa` TEXT DEFAULT NULL,
  `riskLevel` VARCHAR(20) NOT NULL DEFAULT 'Medium',
  `payoutIntervalEn` VARCHAR(100) DEFAULT NULL,
  `payoutIntervalFa` VARCHAR(100) DEFAULT NULL,
  `bourseSymbol` VARCHAR(50) DEFAULT NULL,
  `tsetmcUrl` VARCHAR(500) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Dumping data for table `assets`
-- --------------------------------------------------------
INSERT INTO `assets` (`id`, `enName`, `faName`, `category`, `price`, `change_pct`, `flag`, `locationEn`, `locationFa`, `progress`, `descriptionEn`, `descriptionFa`, `backingEn`, `backingFa`, `custodianEn`, `custodianFa`, `riskLevel`, `payoutIntervalEn`, `payoutIntervalFa`, `bourseSymbol`, `tsetmcUrl`) VALUES
('FOOLAD', 'Mobarakeh Steel', 'فولاد مبارکه', 'metals', 0.0820, 2.40, 'ir', 'Isfahan, Iran', 'اصفهان، ایران', 82, 'Mobarakeh Steel Complex is the largest steelmaker in the Middle East and North Africa.', 'شرکت فولاد مبارکه بزرگ‌ترین مجتمع صنعتی ایران و بزرگ‌ترین تولیدکننده فولاد تخت در خاورمیانه است.', '100% Backed by audited physical hot & cold-rolled steel coils.', 'پشتوانه ۱۰۰٪ فیزیکی کلاف‌های فولادی نورد گرم و سرد.', 'Tejarat Custody Vaults & IME Warehouse System', 'انبار رسمی بورس کالای ایران و صندوق امانات بانک تجارت', 'Low', 'Quarterly Cash Dividend', 'توزیع سود نقدی سه‌ماهه', 'فولاد', 'https://tsetmc.com/instCode/35700344742885862'),
('FMILI', 'National Copper', 'ملی مس ایران', 'metals', 0.1150, 1.80, 'ir', 'Kerman, Iran', 'کرمان، ایران', 91, 'National Iranian Copper Industries Co. operates Sarcheshmeh & Sungun mines.', 'شرکت ملی صنایع مس ایران مالک معادن عظیم سرچشمه و سونگون است.', 'Physical LME-grade copper cathodes (99.99% purity).', 'کاتد مس با خلوص ۹۹.۹۹٪ مطابق استاندارد بورس فلزات لندن.', 'Sarcheshmeh Refinery Depository', 'مخزن رسمی مجتمع مس سرچشمه و بانک رفاه', 'Low', 'Semi-annual Payout', 'توزیع سود شش‌ماهه', 'فملی', 'https://tsetmc.com/instCode/35425587644337450'),
('ZOB', 'Zob Ahan Isfahan', 'ذوب آهن اصفهان', 'metals', 0.0410, -1.20, 'ir', 'Isfahan, Iran', 'اصفهان، ایران', 64, 'Isfahan Steel Mill is the pioneer of blast furnace steel production in Iran.', 'شرکت ذوب‌آهن اصفهان اولین و بزرگ‌ترین کارخانه تولیدکننده فولاد ساختمانی در ایران است.', 'Audited inventory of structural steel beams, rails, and billets.', 'موجودی انبار تیرآهن، ریل ساختمانی و شمش‌های فولادی.', 'Isfahan Central Industrial Vault', 'انبار مرکزی ذوب‌آهن و بانک ملی ایران', 'Medium', 'Annual Settlement', 'تسویه سود سالانه', 'ذوب', 'https://tsetmc.com/instCode/12836267756828456'),
('KHODRO', 'Iran Khodro', 'ایران خودرو', 'auto', 0.0450, -0.50, 'ir', 'Tehran, Iran', 'تهران، ایران', 73, 'Iran Khodro Industrial Group (IKCO) is the premier automotive manufacturer.', 'گروه صنعتی ایران‌خودرو بزرگ‌ترین شرکت خودروسازی ایران و منطقه خاورمیانه است.', 'Backed by commercial fleet assets and verified raw material inventory.', 'پشتوانه ناوگان صنعتی و انبار قطعات و مواد اولیه شرکت.', 'IKCO Asset Trust Vault', 'صندوق امانت‌داری دارایی‌های ایران‌خودرو و بانک پارسیان', 'Medium', 'Annual Distribution', 'توزیع سود سالانه', 'خودرو', 'https://tsetmc.com/instCode/65883838195688438'),
('SAIPA', 'Saipa Group', 'سایپا', 'auto', 0.0380, 1.10, 'ir', 'Tehran, Iran', 'تهران، ایران', 68, 'SAIPA Automobile Manufacturing Company specializes in commercial passenger vehicles.', 'شرکت خودروسازی سایپا از قطب‌های اصلی صنعت خودرو و مونتاژ تجاری کشور است.', 'Backed by automotive manufacturing assets and logistics warehouse inventory.', 'پشتوانه خطوط تولید خودروسازی و انبار قطعات سایپا.', 'Saipa Logistics Trust Depository', 'صندوق امانات سایپا و بانک صادرات', 'Medium', 'Annual Settlement', 'تسویه سود سالانه', 'خساپا', 'https://tsetmc.com/instCode/35326685970182741'),
('GOLD', 'Gold Bullion Vault', 'شمش طلا ۱۸ عیار', 'precious', 1200.0000, 3.20, 'ir', 'Tehran, Iran', 'تهران، ایران', 95, 'Fractional ownership of 1kg 999.9 fine gold bars stored in Central Bank secured vaults.', 'توکن مالکیت خرد شمش‌های ۱ کیلوگرمی طلای خالص ۹۹۹.۹ در خزانه مرکزی.', '100% Physical Gold Bullion in Central Bank Vault.', 'پشتوانه ۱۰۰٪ شمش‌های فیزیکی طلا در خزانه مرکزی.', 'Central Bank Depository', 'خزانه مرکزی بانک کارآفرین و بورس کالا', 'Low', 'Capital Growth', 'رشد ارزش سرمایه', 'طلا', 'https://tsetmc.com/instCode/1000000000000001'),
('OIL-TOKEN', 'Heavy Crude Oil', 'نفت سنگین صادراتی', 'energy', 75.4000, 0.80, 'ir', 'Kharg Island, Iran', 'جزیره خارگ، ایران', 78, 'Tokenized crude oil storage barrels ready for international FOB distribution.', 'توکن‌های بشکه نفت سنگین صادراتی تحویل روی عرشه (FOB).', 'Physical Crude Oil stored in Kharg Oil Terminal.', 'بشکه‌های ذخیره‌سازی نفت در پایانه نفتی خارگ.', 'National Oil Depository', 'پایانه نفتی خارگ و شرکت ملی نفت', 'High', 'Perpetual Trading', 'معامله مستمر و نقدشوندگی بالا', 'نفت', 'https://tsetmc.com/instCode/1000000000000002');

-- --------------------------------------------------------
-- Table structure for `users`
-- --------------------------------------------------------
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `usdt_balance` DECIMAL(18,4) NOT NULL DEFAULT '12500.0000',
  `toman_balance` DECIMAL(18,2) NOT NULL DEFAULT '850000000.00',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `email`, `password_hash`, `name`, `usdt_balance`, `toman_balance`) VALUES
(1, 'demo@assetchain.io', '$2y$10$e8T/E1Y/A.O3S1c5i2gTtuH1S1K0R2s/J2M1L2N3O4P5Q6R7S8T9U', 'Demo Investor', 12500.0000, 850000000.00);

-- --------------------------------------------------------
-- Table structure for `portfolio`
-- --------------------------------------------------------
CREATE TABLE `portfolio` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `asset_id` VARCHAR(50) NOT NULL,
  `shares` DECIMAL(18,4) NOT NULL DEFAULT '0.0000',
  `avg_price` DECIMAL(18,4) NOT NULL DEFAULT '0.0000',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `portfolio` (`user_id`, `asset_id`, `shares`, `avg_price`) VALUES
(1, 'GOLD', 5.0000, 1180.0000),
(1, 'FOOLAD', 10000.0000, 0.0800);

-- --------------------------------------------------------
-- Table structure for `purchase_lots`
-- --------------------------------------------------------
CREATE TABLE `purchase_lots` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `asset_id` VARCHAR(50) NOT NULL,
  `shares` DECIMAL(18,4) NOT NULL,
  `buy_price` DECIMAL(18,4) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `purchase_lots` (`user_id`, `asset_id`, `shares`, `buy_price`) VALUES
(1, 'GOLD', 5.0000, 1180.0000),
(1, 'FOOLAD', 10000.0000, 0.0800);

-- --------------------------------------------------------
-- Table structure for `orders`
-- --------------------------------------------------------
CREATE TABLE `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `asset_id` VARCHAR(50) NOT NULL,
  `type` ENUM('buy_limit', 'sell_limit') NOT NULL,
  `target_price` DECIMAL(18,4) NOT NULL,
  `shares` DECIMAL(18,4) NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `activities`
-- --------------------------------------------------------
CREATE TABLE `activities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `title_en` VARCHAR(255) NOT NULL,
  `title_fa` VARCHAR(255) NOT NULL,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `activities` (`user_id`, `type`, `title_en`, `title_fa`) VALUES
(1, 'system', 'Account created and initialized', 'حساب کاربری ایجاد و فعال شد');
