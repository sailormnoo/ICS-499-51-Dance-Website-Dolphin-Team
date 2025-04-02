<?php

@include '../src/config/database.php';
session_start();

// if (!isset($_SESSION['username'])) {
//     die('Access denied. Please log in.');
// }

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_SESSION['username'];
    $feedback = trim($_POST['feedback']);

    if (strlen($feedback) > 300) {
        die('Feedback must be 300 characters or less.');
    }

    $feedback = mysqli_real_escape_string($conn, $feedback);
    $insert_query = "INSERT INTO feedback (username, feedback_text, created_at) VALUES ('$username', '$feedback', NOW())";

    if (mysqli_query($conn, $insert_query)) {
        header('Location: feedback.php?success=1');
        exit();
    } else {
        die('Error submitting feedback: ' . mysqli_error($conn));
    }
}
?>
