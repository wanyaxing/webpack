<?php
    $currentUserResult = Utility::getCurrentUserResult();

    if (!is_object($currentUserResult))
    {
        echo 'no auth here';
    }
    else
    {
        if (isset($_GET['corpid']))
        {
            UserConnect::requestLogOut();
            header('location:'.'http://' .  $_SERVER['HTTP_HOST'] .  $_SERVER['REQUEST_URI'],302);
        }
        else
        {
            header('location:/',302);
        }
    }
