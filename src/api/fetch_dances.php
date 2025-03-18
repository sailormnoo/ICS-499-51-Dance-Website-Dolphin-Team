<?php
require __DIR__ . '/../config/database.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);
// Ensure connection is successful
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Query to fetch dance details`
$sql = "
    SELECT 
        dances.dance_name, 
        dances.description, 
        dances.region, 
        media.media_url, 
        media.alttext, 
        dance_categories.category_name
    FROM dances
    LEFT JOIN media ON dances.media_id = media.media_id
    LEFT JOIN dance_categories ON dances.category_id = dance_categories.category_id
";

$result = $conn->query($sql);

$dances = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $dances[] = [
            "dance_name" => $row['dance_name'] ?? 'Unknown',
            "description" => $row['description'] ?? 'No description available',
            "category" => $row['category_name'] ?? 'Uncategorized',
            "region" => $row['region'] ?? 'Unknown',
            "media_url" => $row['media_url'] ?? '',
            "alttext" => $row['alttext'] ?? 'Dance image'
        ];
    }
}

echo json_encode($dances);

$conn->close();
?>
