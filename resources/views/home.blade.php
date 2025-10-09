<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Teacher Management System</title>
        <!-- Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                background-color: #000000ff;
                min-height: 100vh;
                position: relative;
                overflow-x: hidden;
            }

            .background_img {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                z-index: 0;
            }

            .background_img img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                filter: blur(8px);  
                opacity: 0.8;
            }

            .content-wrapper {
                position: relative;
                z-index: 1;
                min-height: calc(100vh - 100px);
                padding: 20px;
            }

            .text1 {
                color: white;         
                font-size: clamp(24px, 5vw, 36px);
                font-weight: bold;
                text-align: center;
                line-height: 1.2;
                margin-top: 20px;
                margin-bottom: 10px;
            }

            .text2 {
                color: white;         
                font-size: clamp(16px, 3vw, 20px);
                font-weight: bold;
                text-align: center;
                margin-bottom: 30px;
            }

            .welcome_section {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 20px;
                padding: 20px;
                max-width: 1200px;
                margin: 0 auto;
            }

            .welcome_img {
                max-width: 100%;
                height: auto;
                width: clamp(200px, 50vw, 400px);
                margin-bottom: 20px;
            }

            .text3 {
                color: white;         
                font-size: clamp(14px, 2.5vw, 18px);
                font-weight: bold;
                text-align: center;
                margin-bottom: 20px;
                padding: 0 15px;
                line-height: 1.5;
            }

            .button-container {
                display: flex;
                flex-direction: column;
                gap: 20px;
                width: 100%;
                max-width: 300px;
                align-items: center;
            }

            .loginbtn, .registerbtn {
                color: white;
                font-size: clamp(16px, 2.5vw, 18px);
                font-weight: bold;
                border-radius: 20px;
                width: 100%;
                max-width: 250px;
                height: 50px;
                display: flex;            
                align-items: center;      
                justify-content: center;   
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
            }

            .loginbtn {
                background-color: blue;
            }

            .loginbtn:hover {
                background-color: #0000cc;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 255, 0.3);
            }

            .registerbtn {
                background-color: white;
                color: black;
            }

            .registerbtn:hover {
                background-color: #f0f0f0;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(255, 255, 255, 0.3);
            }

            footer {
                position: relative;
                width: 100%;
                background: rgba(0, 0, 0, 0.9); 
                color: white;
                padding: 30px 40px;
                font-size: clamp(13px, 2vw, 15px);
                z-index: 2;
                margin-top: auto;
            }

            .footer-container {
                max-width: 1400px;
                margin: 0 auto;
            }

            .footer-content {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 25px;
                gap: 40px;
            }

            .footer-contact {
                text-align: left;
                flex: 1;
            }

            .footer-contact p {
                margin: 8px 0;
                line-height: 1.6;
            }

            .footer-location {
                text-align: right;
                flex: 1;
            }

            .footer-location p {
                margin: 8px 0;
                line-height: 1.6;
            }

            .footer-location p:first-child {
                font-weight: 600;
                font-size: 1.1em;
                margin-bottom: 12px;
            }

            .footer-copyright {
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.2);
                font-size: 0.95em;
            }

            /* Tablet and larger screens */
            @media (min-width: 768px) {
                .welcome_section {
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: space-around;
                    align-items: center;
                    gap: 40px;
                }

                .welcome_img {
                    width: clamp(250px, 35vw, 400px);
                    margin-bottom: 0;
                }

                .text3 {
                    text-align: left;
                    max-width: 400px;
                }

                .button-container {
                    flex-direction: row;
                    gap: 20px;
                    max-width: 100%;
                }

                .content-wrapper {
                    padding: 40px;
                }

                footer {
                    padding: 25px 20px;
                }
            }

            /* Desktop screens */
            @media (min-width: 1024px) {
                .content-wrapper {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .welcome_section {
                    margin-top: 40px;
                }

                .text1 {
                    margin-top: 40px;
                }
            }

            /* Small mobile screens */
            @media (max-width: 480px) {
                .text1 {
                    font-size: 22px;
                }

                .text2 {
                    font-size: 14px;
                }

                .text3 {
                    font-size: 13px;
                }

                .loginbtn, .registerbtn {
                    height: 45px;
                    font-size: 15px;
                }

                .content-wrapper {
                    padding: 15px;
                }

                footer {
                    padding: 20px 15px;
                    font-size: 12px;
                }
            }
        </style>
    </head>
    <body>
        <div class="background_img">
            <img src="{{ asset('images/schoolImage.jpeg') }}" alt="School Background">
        </div>


        <div class="content-wrapper">
            <div class="text1">
                <p>Teacher Management<br> System</p>
            </div>
            <div class="text2">
                <p>Karandeniya Central College</p>
            </div>
            
            <div class="welcome_section">
                <img src="{{ asset('images/welcome.png') }}" class="welcome_img" alt="Welcome">
                
                <div>
                    <div class="text3">
                        <p>Welcome to the Teacher Management System<br>Karandeniya Central College</p>
                    </div>
                    
                    <div class="button-container">
                        <a href="https://www.google.com" style="text-decoration: none; width: 100%; max-width: 250px;">
                            <button class="loginbtn">Login</button>
                        </a>
                        <a href="https://www.google.com" style="text-decoration: none; width: 100%; max-width: 250px;">
                            <button class="registerbtn">Register</button>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <footer>
            <div class="footer-container">
                <div class="footer-content">
                    <div class="footer-contact">
                        <p>Hotline : 091 229 3938</p>
                        <p>Email : codeorbit@gmail.com</p>
                    </div>
                    <div class="footer-location">
                        <p>Location</p>
                        <p>Karandeniya Central College,</p>
                        <p>Karandeniya,</p>
                        <p>Sri Lanka</p>
                    </div>
                </div>
                <div class="footer-copyright">
                    © 2025 Karandeniya Central College — Teacher Management System
                </div>
            </div>
        </footer>
    </body>
</html>