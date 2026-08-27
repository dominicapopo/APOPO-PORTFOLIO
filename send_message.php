<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name    = isset($_POST['name']) ? trim(strip_tags($_POST['name'])) : '';
    $email   = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL) : '';
    $subject = isset($_POST['subject']) ? trim(strip_tags($_POST['subject'])) : 'New Portfolio Contact';
    $message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

    if (empty($name) || !$email || empty($message)) {
        echo json_encode([
            'status'  => 'error',
            'message' => 'Please complete all required fields with a valid email address.'
        ]);
        exit;
    }

    $logEntry = "[" . date('Y-m-d H:i:s') . "] FROM: {$name} ({$email}) | SUBJECT: {$subject}\nMESSAGE: {$message}\n----------------------------------------\n";
    @file_put_contents(__DIR__ . '/messages.log', $logEntry, FILE_APPEND);

    echo json_encode([
        'status'  => 'success',
        'message' => 'Thank you ' . htmlspecialchars($name) . '! Your message has been received. Dominic will contact you shortly.'
    ]);
    exit;
}

echo json_encode([
    'status'  => 'error',
    'message' => 'Invalid request method.'
]);
