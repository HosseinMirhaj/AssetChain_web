<?php
// ============================================================
// AssetChain RWA Platform - PHP Configuration
// ============================================================

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'assetchain_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_PORT', '3306');

// Enable Error Reporting during development (Set to 0 in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS Headers (Allow requests from any frontend domain)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, x-user-email");
header("Content-Type: application/json; charset=UTF-8");

// Handle OPTIONS preflight HTTP request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Standard JSON Response Helper
 */
function jsonResponse($success, $data = [], $message = '', $statusCode = 200) {
    http_response_code($statusCode);
    $response = array_merge(['success' => $success], $data);
    if (!empty($message)) {
        $response['message'] = $message;
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}
