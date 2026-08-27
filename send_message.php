<?php
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name    = isset($_POST['name']) ? trim(strip_tags($_POST['name'])) : '';
    $email   = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL) : '';
    $subject = isset($_POST['subject']) ? trim(strip_tags($_POST['subject'])) : 'New Portfolio Contact';
    $message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

    $name = str_replace(["\r", "\n"], ' ', $name);
    $subject = str_replace(["\r", "\n"], ' ', $subject);

    if (empty($name) || !$email || empty($message) || strlen($name) > 80 || strlen($subject) > 120 || strlen($message) > 3000) {
        http_response_code(422);
        echo json_encode([
            'status'  => 'error',
            'message' => 'Please complete all required fields with a valid email address.'
        ]);
        exit;
    }

    $logEntry = "[" . date('Y-m-d H:i:s') . "] FROM: {$name} ({$email}) | SUBJECT: {$subject}\nMESSAGE: {$message}\n----------------------------------------\n";
    $saved = file_put_contents(__DIR__ . '/messages.log', $logEntry, FILE_APPEND | LOCK_EX);

    if ($saved === false) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Your message could not be saved. Please email apopod14@gmail.com directly.'
        ]);
        exit;
    }

    echo json_encode([
        'status'  => 'success',
        'message' => 'Thank you ' . htmlspecialchars($name) . '! Your message has been received. Dominic will contact you shortly.'
    ]);
    exit;
}

http_response_code(405);
echo json_encode([
    'status'  => 'error',
    'message' => 'Invalid request method.'
]);
