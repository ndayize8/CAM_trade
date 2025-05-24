<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

require_once 'config.php';

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_GET['action'])) {
        if ($_GET['action'] === 'register') {
            // Register user
            $username = $data->username;
            $email = $data->email;
            $password = password_hash($data->password, PASSWORD_DEFAULT);

            $query = "INSERT INTO users (username, email, password) VALUES (:username, :email, :password)";
            $stmt = $pdo->prepare($query);

            try {
                $stmt->execute(['username' => $username, 'email' => $email, 'password' => $password]);
                echo json_encode(['message' => 'User registered successfully']);
            } catch(PDOException $e) {
                echo json_encode(['error' => 'Registration failed']);
            }
        } 
        elseif ($_GET['action'] === 'login') {
            // Login user
            $email = $data->email;
            $password = $data->password;

            $query = "SELECT * FROM users WHERE email = :email";
            $stmt = $pdo->prepare($query);
            $stmt->execute(['email' => $email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password'])) {
                $token = bin2hex(random_bytes(32));
                echo json_encode([
                    'message' => 'Login successful',
                    'user' => [
                        'id' => $user['id'],
                        'username' => $user['username'],
                        'email' => $user['email']
                    ],
                    'token' => $token
                ]);
            } else {
                echo json_encode(['error' => 'Invalid credentials']);
            }
        }
    }
}
?>