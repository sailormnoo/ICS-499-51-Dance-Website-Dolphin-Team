<?php
require __DIR__ . '/../config/database.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

// Ensure connection is successful
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}
// Read POST data
$filters = json_decode(file_get_contents("php://input"), true);
$region = isset($filters['region']) ? $conn->real_escape_string($filters['region']) : null;
$category = isset($filters['category']) ? $conn->real_escape_string($filters['category']) : null;

// Debugging: Log received data
error_log("Region: " . ($region ?? "NULL") . " | Category: " . ($category ?? "NULL"));

$sql = "
    SELECT 
        dances.dance_name, 
        dances.description, 
        region.region_name, 
        media.media_url, 
        media.alttext, 
        dance_categories.category_name
    FROM dances
    LEFT JOIN media ON dances.media_id = media.media_id
    LEFT JOIN dance_categories ON dances.category_id = dance_categories.category_id
    LEFT JOIN region ON dances.region = region.region_key
";

// Apply filters
$conditions = [];
if (!empty($region)) {
    $conditions[] = "region.region_name = '$region'";
}
if (!empty($category)) {
    $conditions[] = "dance_categories.category_name = '$category'";
}

// Append WHERE clause if needed
if (!empty($conditions)) {
    $sql .= " WHERE " . implode(" AND ", $conditions);
}

// Debugging: Log the final SQL query
error_log("Final SQL Query: " . $sql);

$result = $conn->query($sql);

$dances = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $dances[] = [
            "dance_name" => $row['dance_name'] ?? 'Unknown',
            "description" => $row['description'] ?? 'No description available',
            "category" => $row['category_name'] ?? 'Uncategorized',
            "region" => $row['region_name'] ?? 'Unknown',
            "media_url" => $row['media_url'] ?? '',
            "alttext" => $row['alttext'] ?? 'Dance image'
        ];
    }
} else {
    error_log("No dances found for the query.");
}

echo json_encode($dances);
$conn->close();
?>
