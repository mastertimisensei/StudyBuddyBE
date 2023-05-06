<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<form action="index.php" method="post">
        <label for="username">Username</label>
        <input type="text" name="username" id="username">
        <label for="password">Password</label>
        <input type="password" name="password" id="password">
        <input type="submit" value="Login">
    </form>
</body>
</html>


<?php
if (isset($_POST['username']) && isset($_POST['password'])) {
    $data = array(
        'email' => $_POST['username'],
        'password' => $_POST['password']
    );
    $data_string = json_encode($data);

    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_URL => 'https://studybuddy-backend.onrender.com/signIn',
        CURLOPT_POST => 1,
        CURLOPT_POSTFIELDS => $data_string,
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data_string)
        )
    ]); 
    $resp = curl_exec($curl);
    curl_close($curl);
    $resp = json_decode($resp);
    var_dump($resp);
    if ($resp->status == "success") {
        echo "Login successful";
        session_start();
        $_SESSION['token'] = $resp->token;
        header("Location: index.php");
    } else {
        echo "Login failed";
    }
} else {
    echo "Please fill in both username and password fields";
}
?>
   