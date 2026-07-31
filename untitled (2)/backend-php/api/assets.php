<?php
// ============================================================
// AssetChain - Assets API Endpoint
// GET /backend-php/api/assets.php
// GET /backend-php/api/assets.php?id=FOOLAD
// GET /backend-php/api/assets.php?category=metals
// ============================================================

require_once __DIR__ . '/../db.php';

$db = getDB();

$assetId = isset($_GET['id']) ? trim($_GET['id']) : null;
$category = isset($_GET['category']) ? trim($_GET['category']) : null;

if ($assetId) {
    // Single asset detail
    $stmt = $db->prepare("SELECT * FROM assets WHERE UPPER(id) = UPPER(:id)");
    $stmt->execute(['id' => $assetId]);
    $asset = $stmt->fetch();

    if (!$asset) {
        jsonResponse(false, ['error' => 'Asset not found'], '', 404);
    }

    // Convert price and numbers to float for consistency
    $asset['price'] = (float)$asset['price'];
    $asset['change'] = (float)$asset['change_pct'];
    $asset['progress'] = (int)$asset['progress'];

    jsonResponse(true, ['asset' => $asset]);
} else {
    // List all assets
    if ($category && $category !== 'all') {
        $stmt = $db->prepare("SELECT * FROM assets WHERE category = :category ORDER BY id ASC");
        $stmt->execute(['category' => $category]);
    } else {
        $stmt = $db->query("SELECT * FROM assets ORDER BY id ASC");
    }

    $assets = $stmt->fetchAll();

    foreach ($assets as &$a) {
        $a['price'] = (float)$a['price'];
        $a['change'] = (float)$a['change_pct'];
        $a['progress'] = (int)$a['progress'];
    }

    jsonResponse(true, ['count' => count($assets), 'assets' => $assets]);
}
