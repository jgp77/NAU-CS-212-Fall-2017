<!DOCTYPE html>
<head>
    <meta charset = "UTF-8">
    <title>Project 4 - Guestbook</title>
</head>

<html>

<body>
<form action = "4_sign_guestbook.php" method = "post">
    Name:
    <input type = "text" id = "name" name = "name" content = "hello">
    <br>
    Note:
    <input type = "text" id = "note" name = "note" content = "hello">
    <br>
    <button type = "submit" name = "submit-btn" id = "submit-btn">Submit</button>

</form>
<?php
$conn = mysqli_connect("tund.cefns.nau.edu", "jgp77", "thisisapassword", "jgp77");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


if (isset($_POST['submit-btn']) && $_POST['name'] != "" && $_POST['note'] != "") {

    $stmt=$conn->prepare("INSERT INTO Signatures (name, note) VALUES (?, ?)");
    $stmt->bind_param("ss",$name,$note);

    $name = $_POST['name'];
    $note = $_POST['note'];
    if($stmt->execute())
    {
        echo '<h1 id="submitted-msg"> Successfully Submitted</h1>';
    }
}
$stmt->close();
$conn->close();
?>
</body>
</html>


