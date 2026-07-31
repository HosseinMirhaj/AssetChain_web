<?php
// ============================================================
// AssetChain - Authentication API Endpoint
// POST /backend-php/api/auth.php?action=login
// POST /backend-php/api/auth.php?action=register
// ============================================================

require_once __DIR__ . '/../db.php';

$db = getDB();
$action = isset($_GET['action']) ? $_GET['action'] : 'login';

$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody, true) ?: $_POST;

$email = isset($data['email']) ? trim($data['email']) : 'demo@assetchain.io';
$password = isset($data['password']) ? trim($data['password']) : '123456';
$name = isset($data['name']) ? trim($data['name']) : '';

if ($action === 'register') {
    if (empty($email) || empty($password)) {
        jsonResponse(false, ['error' => 'Email and password are required'], '', 400);
    }

    // Check if user exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    if ($stmt->fetch()) {
        jsonResponse(false, ['error' => 'User with this email already exists'], '', 400);
    }

    // Insert user
    $passHash = password_hash($password, PASSWORD_BCRYPT);
    $userName = !empty($name) ? $name : explode('@', $email)[0];

    $insert = $db->prepare("INSERT INTO users (email, password_hash, name, usdt_balance, toman_balance) VALUES (:email, :pass, :name, 10000.0000, 600000000.00)");
    $insert->execute([
        'email' => $email,
        'pass'  => $passHash,
        'name'  => $userName
    ]);
    $userId = $db->lastInsertId();

    // Log activity
    $log = $db->prepare("INSERT INTO activities (user_id, type, title_en, title_fa) VALUES (:uid, 'system', 'Account registered', 'حساب کاربری ثبت شد')");
    $log->execute(['uid' => $userId]);

    jsonResponse(true, [
        'user' => [
            'id' => $userId,
            'email' => $email,
            'name' => $userName,
            'usdtBalance' => 10000.00,
            'tomanBalance' => 600000000.00
        ],
        'token' => 'bearer_' . base64_encode($email)
    ], 'Registration successful', 201);

} else {
    // LOGIN
    $stmt = $db->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if (!$user) {
        // If demo user doesn't exist, create automatically
        $passHash = password_hash('123456', PASSWORD_BCRYPT);
        $insert = $db->prepare("INSERT INTO users (email, password_hash, name, usdt_balance, toman_balance) VALUES (:email, :pass, :name, 12500.0000, 850000000.00)");
        $insert->execute([
            'email' => $email,
            'pass'  => $passHash,
            'name'  => explode('@', $email)[0]
        ]);
        $userId = $db->lastInsertId();
        
        $stmt = $db->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->execute(['id' => $userId]);
        $user = $stmt->fetch();
    }

    jsonResponse(true, [
        'user' => [
            'id' => (int)$user['id'],
            'email' => $user['email'],
            'name' => $user['name'],
            'usdtBalance' => (float)$user['usdt_balance'],
            'tomanBalance' => (float)$user['toman_balance']
        ],
        'token' => 'bearer_' . base64_encode($user['email'])
    ], 'Login successful');
}
