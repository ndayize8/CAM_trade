<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['file'])) {
        echo json_encode(['error' => 'No file uploaded']);
        exit;
    }

    $file = $_FILES['file'];
    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $userId = $_POST['userId'] ?? null;

    // Validate file
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!in_array($file['type'], $allowedTypes)) {
        echo json_encode(['error' => 'Invalid file type']);
        exit;
    }

    // Generate unique filename
    $filename = uniqid() . '-' . $file['name'];
    $uploadPath = 'uploads/' . $filename;

    if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
        // Save file info to database
        $query = "INSERT INTO uploads (title, description, file_url, user_id) VALUES (:title, :description, :file_url, :user_id)";
        $stmt = $pdo->prepare($query);

        try {
            $stmt->execute([
                'title' => $title,
                'description' => $description,
                'file_url' => $uploadPath,
                'user_id' => $userId
            ]);

            echo json_encode([
                'message' => 'File uploaded successfully',
                'file' => [
                    'title' => $title,
                    'description' => $description,
                    'url' => $uploadPath
                ]
            ]);
        } catch(PDOException $e) {
            echo json_encode(['error' => 'Failed to save file information']);
        }
    } else {
        echo json_encode(['error' => 'Failed to upload file']);
    }
}
?>