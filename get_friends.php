<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include 'db.php';

$sql = "SELECT * FROM friends";
$result = $conn->query($sql);
$friends = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $row['online'] = $row['online'] == 1 ? true : false;
        $friends[] = $row;
    }
} else {
    echo json_encode(array());
}
$conn->close();
echo json_encode($friends);
?>
