<?php



require __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $dance_name = $_POST['dance_name'] ?? '';
  $category_id = $_POST['category_id'] ?? '';
  $region = $_POST['region'] ?? '';
  $description = $_POST['description'] ?? '';

  if (empty($dance_name) || empty($category_id) || empty($region)) {
    exit('Please fill in all required fields.');
  }

  $media_id = 'NULL';

  if (isset($_FILES['dance_image']) && $_FILES['dance_image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . '/../../public/assets/images';
    $filename = time() . '_' . basename($_FILES['dance_image']['name']);

    $targetFile = $uploadDir . '/' . $filename;

    if (!is_dir($uploadDir)) {
      mkdir($uploadDir, 0777, true);
    }

    if (move_uploaded_file($_FILES['dance_image']['tmp_name'], $targetFile)) {
      $mediaPath = 'assets/images/' . $filename;
      $altText = $dance_name . ' image';

      $stmtMedia = $conn->prepare("INSERT INTO media (media_url, alttext) VALUES (?, ?)");
      $stmtMedia->bind_param("ss", $mediaPath, $altText);
      $stmtMedia->execute();
      $media_id = $stmtMedia->insert_id;
      $stmtMedia->close();
    } else {
      exit('Error uploading file. Please try again.');
    }
  }

  $sqlDance = "INSERT INTO dances (dance_name, category_id, description, media_id, region)
VALUES (?, ?, ?, ?, ?)";
  $stmtDance = $conn->prepare($sqlDance);

  if ($media_id === 'NULL') {
    $stmtDance->bind_param("sisii", $dance_name, $category_id, $description, $media_id, $region);;
    $media_id = null;
  } else {
    $stmtDance->bind_param("sisii", $dance_name, $category_id, $description, $media_id, $region);
  }

  if ($stmtDance->execute()) {
    echo "Dance created successfully!";
  } else {
    echo "Error creating dance: " . $conn->error;
  }

  $stmtDance->close();
  $conn->close();
} else {
  echo "Invalid request method.";
}
