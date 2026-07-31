<?php
// ============================================================
// AssetChain - User Profile & Portfolio API Endpoint
// GET /backend-php/api/user.php
// ============================================================

require_once __DIR__ . '/../db.php';

$db = getDB();

// Get user email from headers or query param
$headers = getallheaders();
$userEmail = isset($headers['x-user-email']) ? trim($headers['x-user-email']) : (isset($_GET['email']) ? trim($_GET['email']) : 'demo@assetchain.io');

$stmt = $db->prepare("SELECT * FROM users WHERE email = :email");
$stmt->execute(['email' => $userEmail]);
$user = $stmt->fetch();

if (!$user) {
    jsonResponse(false, ['error' => 'User profile not found'], '', 404);
}

$userId = (int)$user['id'];

// Fetch portfolio
$pStmt = $db->prepare("SELECT p.asset_id as assetId, p.shares, p.avg_price as avgPrice, a.enName, a.faName, a.price as currentPrice FROM portfolio p JOIN assets a ON p.asset_id = a.id WHERE p.user_id = :uid");
$pStmt->execute(['uid' => $userId]);
$portfolio = $pStmt->fetchAll();

foreach ($portfolio as &$p) {
    $p['shares'] = (float)$p['shares'];
    $p['avgPrice'] = (float)$p['avgPrice'];
    $p['currentPrice'] = (float)$p['currentPrice'];
}

// Fetch purchase lots
$lStmt = $db->prepare("SELECT id, asset_id as assetId, shares, buy_price as buyPrice, created_at as date FROM purchase_lots WHERE user_id = :uid ORDER BY id DESC");
$lStmt->execute(['uid' => $userId]);
$lots = $lStmt->fetchAll();

foreach ($lots as &$l) {
    $l['shares'] = (float)$l['shares'];
    $l['buyPrice'] = (float)$l['buyPrice'];
}

// Fetch activities
$aStmt = $db->prepare("SELECT id, type, title_en as titleEn, title_fa as titleFa, timestamp FROM activities WHERE user_id = :uid ORDER BY id DESC LIMIT 50");
$aStmt->execute(['uid' => $userId]);
$activities = $aStmt->fetchAll();

jsonResponse(true, [
    'user' => [
        'id' => $userId,
        'email' => $user['email'],
        'name' => $user['name'],
        'usdtBalance' => (float)$user['usdt_balance'],
        'tomanBalance' => (float)$user['toman_balance'],
        'portfolio' => $portfolio,
        'purchaseLots' => $lots,
        'activities' => $activities
    ]
]);
