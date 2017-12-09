<!DOCTYPE html>
<html>
    <body>
    <?php
    $conn = mysqli_connect("tund.cefns.nau.edu", "jgp77", "thisisapassword", "jgp77");
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $sql = "SELECT name,note FROM Signatures";
    $result=mysqli_query($conn,$sql);
    if(mysqli_num_rows($result) > 0)
    {
        while($row = mysqli_fetch_assoc($result))
        {
            echo '<h2>Post:</h2>';
            echo '<div class="signature">';
            echo '<pre class="note">';
            echo "<bold>Note:</bold> <br>".$row['note'];
            echo '</pre>';
            echo '<div class="name">';
            echo "<bold>Name: </bold><br>".$row['name'];
            echo '</div>';
            echo '</div>';
            echo '<br>';
        }
    }
    else
    {
        echo 'No posts have been made';
    }
    $conn->close();
    ?>
    </body>
</html>