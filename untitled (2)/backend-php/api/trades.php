<?php
// ============================================================
// AssetChain - Buy & Sell Trades API Endpoint
// POST /backend-php/api/trades.php?action=buy
// POST /backend-php/api/trades.php?action=sell
// ============================================================

require_once __DIR__ . '/../db.php';

$db = getDB();
$action = isset($_GET['action']) ? $_GET['action'] : 'buy';

$headers = getallheaders();
$userEmail = isset($headers['x-user-email']) ? trim($headers['x-user-email']) : 'demo@assetchain.io';

$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody, true) ?: $_POST;

$assetId = isset($data['assetId']) ? trim($data['assetId']) : '';
$shares = isset($data['shares']) ? (float)$data['shares'] : 0;

if (empty($assetId) || $shares <= 0) {
    jsonResponse(false, ['error' => 'Invalid asset ID or share amount'], '', 400);
}

// Fetch asset
$aStmt = $db->prepare("SELECT * FROM assets WHERE UPPER(id) = UPPER(:id)");
$aStmt->execute(['id' => $assetId]);
$asset = $aStmt->fetch();

if (!$asset) {
    jsonResponse(false, ['error' => 'Asset not found'], '', 404);
}

// Fetch user
$uStmt = $db->prepare("SELECT * FROM users WHERE email = :email");
$uStmt->execute(['email' => $userEmail]);
$user = $uStmt->fetch();

if (!$user) {
    jsonResponse(false, ['error' => 'User account not found'], '', 404);
}

$userId = (int)$user['id'];
$assetPrice = (float)$asset['price'];
$usdtBalance = (float)$user['usdt_balance'];

if ($action === 'buy') {
    $totalCost = $shares * $assetPrice;

    if ($usdtBalance < $totalCost) {
        jsonResponse(false, ['error' => 'Insufficient USDT balance'], '', 400);
    }

    // Deduct balance
    $newBalance = $usdtBalance - $totalCost;
    $updateUser = $db->prepare("UPDATE users SET usdt_balance = :bal WHERE id = :uid");
    $updateUser->execute(['bal' => $newBalance, 'uid' => $userId]);

    // Check existing portfolio entry
    $pStmt = $db->prepare("SELECT * FROM portfolio WHERE user_id = :uid AND asset_id = :aid");
    $pStmt->execute(['uid' => $userId, 'aid' => $asset['id']]);
    $existing = $pStmt->fetch();

    if ($existing) {
        $oldShares = (float)$existing['shares'];
        $oldAvg = (float)$existing['avg_price'];
        $totalShares = $oldShares + $shares;
        $totalInvested = ($oldShares * $oldAvg) + $totalCost;
        $newAvg = $totalInvested / $totalShares;

        $pUpdate = $db->prepare("UPDATE portfolio SET shares = :s, avg_price = :p WHERE id = :pid");
        $pUpdate->execute(['s' => $totalShares, 'p' => $newAvg, 'pid' => $existing['id']]);
    } else {
        $pInsert = $db->prepare("INSERT INTO portfolio (user_id, asset_id, shares, avg_price) VALUES (:uid, :aid, :s, :p)");
        $pInsert->execute(['uid' => $userId, 'aid' => $asset['id'], 's' => $shares, 'p' => $assetPrice]);
    }

    // Record Purchase Lot
    $lotInsert = $db->prepare("INSERT INTO purchase_lots (user_id, asset_id, shares, buy_price) VALUES (:uid, :aid, :s, :p)");
    $lotInsert->execute(['uid' => $userId, 'aid' => $asset['id'], 's' => $shares, 'p' => $assetPrice]);

    // Log Activity
    $titleEn = "Bought {$shares} shares of #{$asset['id']} at {$assetPrice} USDT";
    $titleFa = "خرید {$shares} سهم از #{$asset['id']} با قیمت {$assetPrice} تتر";
    $act = $db->prepare("INSERT INTO activities (user_id, type, title_en, title_fa) VALUES (:uid, 'trade', :ten, :tfa)");
    $act->execute(['uid' => $userId, 'ten' => $titleEn, 'tfa' => $titleFa]);

    jsonResponse(true, [
        'usdtBalance' => $newBalance,
        'message' => "Successfully bought {$shares} shares of {$asset['enName']}"
    ]);

} else if ($action === 'sell') {
    // Check portfolio
    $pStmt = $db->prepare("SELECT * FROM portfolio WHERE user_id = :uid AND asset_id = :aid");
    $pStmt->execute(['uid' => $userId, 'aid' => $asset['id']]);
    $existing = $pStmt->fetch();

    if (!$existing || (float)$existing['shares'] < $shares) {
        jsonResponse(false, ['error' => 'Insufficient asset shares to sell'], '', 400);
    }

    $totalRevenue = $shares * $assetPrice;
    $remainingShares = (float)$existing['shares'] - $shares;

    if ($remainingShares <= 0) {
        $pDel = $db->prepare("DELETE FROM portfolio WHERE id = :pid");
        $pDel->execute(['pid' => $existing['id']]);
    } else {
        $pUpd = $db->prepare("UPDATE portfolio SET shares = :s WHERE id = :pid");
        $pUpd->execute(['s' => $remainingShares, 'pid' => $existing['id']]);
    }

    // Add USDT balance
    $newBalance = $usdtBalance + $totalRevenue;
    $updateUser = $db->prepare("UPDATE users SET usdt_balance = :bal WHERE id = :uid");
    $updateUser->execute(['bal' => $newBalance, 'uid' => $userId]);

    // Log Activity
    $titleEn = "Sold {$shares} shares of #{$asset['id']} at {$assetPrice} USDT";
    $titleFa = "فروش {$shares} سهم از #{$asset['id']} با قیمت {$assetPrice} تتر";
    $act = $db->prepare("INSERT INTO activities (user_id, type, title_en, title_fa) VALUES (:uid, 'trade', :ten, :tfa)");
    $act->execute(['uid' => $userId, 'ten' => $titleEn, 'tfa' => $titleFa]);

    jsonResponse(true, [
        'usdtBalance' => $newBalance,
        'message' => "Successfully sold {$shares} shares of {$asset['enName']}"
    ]);
}
