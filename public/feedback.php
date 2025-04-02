
<?php
@include '../src/config/database.php';
session_start();

// if (!isset($_SESSION["username"])) {
//     header("Location: login.php");
//     exit();

// }

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Feedback</title>
    <link rel="stylesheet" href="../public/css/style.css">
</head>
<body>

<div class="form-container">
    <form action="submit_feedback.php" method="post">
        <h3>Submit Feedback</h3>
        <textarea name="feedback" maxlength="300" required placeholder="Enter your feedback (max 300 characters)"></textarea>
        <input type="submit" name="submit" value="Submit Feedback" class="form-btn">
    </form>
</div>

</body>
</html>
