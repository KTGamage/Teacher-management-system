<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Teacher Management System</title>
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
                display: flex;
                flex-direction: column;
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
                flex: 1;
                padding: clamp(15px, 3vw, 20px);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .headerSection {
                position: relative;
                z-index: 2;
                width: 100%;
                min-height: auto;
                padding: clamp(15px, 3vw, 20px) clamp(20px, 4vw, 40px);
                background: rgba(255, 255, 255, 0.85);
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: clamp(15px, 3vw, 20px);
            }
            
            .logo-section {
                display: flex;
                align-items: center;
                gap: clamp(15px, 3vw, 20px);
                flex: 1;
                min-width: 0;
            }

            .logo {
                position: absolute;
                top: 0;
                left: clamp(20px, 4vw, 40px);
                width: 80px;
                height: auto;
                z-index: 10;
                border-radius: 0;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                opacity: 1;
                filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
            }

            .title-section {
                flex: 1;
                min-width: 0;
                margin-left: clamp(70px, 12vw, 110px);
            }

            .title-section h1 {
                color: #000;
                font-size: clamp(18px, 3.5vw, 32px);
                font-weight: 700;
                line-height: 1.2;
                margin: 0;
                word-wrap: break-word;
            }

            .title-section h2 {
                color: #000;
                font-size: clamp(14px, 2.5vw, 22px);
                font-weight: 500;
                line-height: 1.3;
                margin: clamp(3px, 1vw, 5px) 0 0 0;
                word-wrap: break-word;
            }

            .nav-section {
                display: flex;
                align-items: center;
                gap: clamp(20px, 4vw, 50px);
                flex-wrap: wrap;
            }

            .nav-section a {
                color: #000;
                text-decoration: none;
                font-size: clamp(16px, 2.2vw, 22px);
                font-weight: 600;
                position: relative;
                padding-bottom: 5px;
                transition: color 0.3s ease;
                white-space: nowrap;
            }

            .nav-section a:hover {
                color: #dc3545;
            }

            .nav-section a.active {
                color: #000;
            }

            .nav-section a.active::after {
                content: '';
                position: absolute;
                bottom: -3px;
                left: 0;
                width: 100%;
                height: 3px;
                background-color: #dc3545;
                border-radius: 2px;
            }
            
            .glassBox {
                width: 100%;
                max-width: 1200px;
                min-height: clamp(450px, 75vh, 650px);
                padding: 0;
                border-radius: clamp(16px, 2vw, 24px);
                background: rgba(255, 255, 255, 0.4);
                backdrop-filter: blur(15px);
                box-shadow: 0 8px 30px rgba(0,0,0,0.35);
                border: 1px solid rgba(255,255,255,0.18);
                display: flex;
                overflow: hidden;
            }

            .login-section {
                flex: 1;
                padding: clamp(30px, 5vw, 60px);
                display: flex;
                flex-direction: column;
                justify-content: center;
                background: rgba(255, 255, 255, 0.2);
            }

            .role-tabs {
                display: flex;
                gap: clamp(15px, 3vw, 30px);
                margin-bottom: clamp(25px, 4vw, 40px);
                flex-wrap: wrap;
            }

            .role-tab {
                color: #333;
                font-size: clamp(16px, 2vw, 20px);
                font-weight: 600;
                cursor: pointer;
                padding-bottom: 8px;
                border-bottom: 3px solid transparent;
                transition: all 0.3s ease;
                white-space: nowrap;
            }

            .role-tab:hover {
                color: #000;
            }

            .role-tab.active {
                color: #000;
                border-bottom-color: #000;
            }

            .login-section h3 {
                color: #000;
                font-size: clamp(16px, 2.2vw, 20px);
                font-weight: 600;
                margin-bottom: clamp(5px, 1vw, 8px);
                text-align: left;
            }

            .form-group {
                margin-bottom: clamp(18px, 3vw, 25px);
            }

            .form-group label {
                display: block;
                color: #000;
                font-size: clamp(14px, 1.8vw, 18px);
                font-weight: 600;
                margin-bottom: 10px;
                text-align: left;
            }

            .form-group input {
                width: 100%;
                padding: clamp(12px, 2.5vw, 16px);
                border: none;
                border-radius: 30px;
                font-size: clamp(14px, 1.8vw, 16px);
                background: rgba(255, 255, 255, 0.9);
                transition: all 0.3s ease;
                color: #666;
            }

            .form-group input::placeholder {
                color: #999;
            }

            .form-group input:focus {
                outline: none;
                background: rgba(255, 255, 255, 1);
                box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
            }

            .login-btn {
                width: 100%;
                max-width: 200px;
                padding: clamp(12px, 2.5vw, 16px) clamp(30px, 5vw, 50px);
                background: #0066ff;
                color: white;
                border: none;
                border-radius: 30px;
                font-size: clamp(16px, 2vw, 18px);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: clamp(10px, 2vw, 15px);
            }

            .login-btn:hover {
                background: #0052cc;
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 102, 255, 0.4);
            }

            .register-link {
                margin-top: clamp(15px, 2vw, 20px);
                color: #000;
                font-size: clamp(14px, 1.8vw, 16px);
            }

            .register-link a {
                color: #0066ff;
                text-decoration: none;
                font-weight: 600;
            }

            .register-link a:hover {
                text-decoration: underline;
            }

            .vertical-divider {
                width: 2px;
                background: linear-gradient(to bottom, 
                    rgba(0, 0, 0, 0),
                    rgba(0, 0, 0, 0.2),
                    rgba(0, 0, 0, 0)
                );
                align-self: stretch;
            }

            .info-section {
                flex: 1;
                padding: clamp(30px, 5vw, 60px);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
            }

            .info-section h2 {
                color: #000;
                font-size: clamp(26px, 4vw, 36px);
                font-weight: 700;
                margin-bottom: clamp(15px, 3vw, 25px);
            }

            .info-section p {
                color: #333;
                font-size: clamp(14px, 2vw, 18px);
                line-height: 1.6;
                margin-bottom: clamp(25px, 4vw, 35px);
                max-width: 400px;
            }

            .info-illustration {
                width: 100%;
                max-width: 350px;
                height: auto;
                margin-top: clamp(20px, 3vw, 30px);
            }

            .info-illustration img {
                width: 100%;
                height: auto;
            }

            footer {
                position: relative;
                width: 100%;
                background: rgba(0, 0, 0, 0.95); 
                color: white;
                padding: clamp(20px, 4vw, 30px) clamp(20px, 4vw, 40px);
                font-size: clamp(12px, 2vw, 15px);
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
                margin-bottom: clamp(15px, 3vw, 20px);
                gap: clamp(20px, 4vw, 40px);
                flex-wrap: wrap;
            }

            .footer-contact {
                text-align: left;
                flex: 1;
                min-width: 200px;
            }

            .footer-contact p {
                margin: clamp(5px, 1vw, 8px) 0;
                line-height: 1.6;
            }

            .footer-location {
                text-align: right;
                flex: 1;
                min-width: 200px;
            }

            .footer-location p {
                margin: clamp(5px, 1vw, 8px) 0;
                line-height: 1.6;
            }

            .footer-location p:first-child {
                font-weight: 600;
                font-size: 1.1em;
                margin-bottom: clamp(8px, 2vw, 12px);
            }

            .footer-copyright {
                text-align: center;
                padding-top: clamp(15px, 3vw, 20px);
                border-top: 1px solid rgba(255, 255, 255, 0.2);
                font-size: 0.95em;
            }

            /* Tablet adjustments */
            @media (max-width: 992px) {
                .headerSection {
                    flex-direction: column;
                    align-items: flex-start;
                }

                .logo-section {
                    width: 100%;
                }

                .nav-section {
                    width: 100%;
                    justify-content: flex-start;
                }

                .glassBox {
                    flex-direction: column;
                    min-height: auto;
                }

                .vertical-divider {
                    width: 80%;
                    height: 2px;
                    align-self: center;
                    background: linear-gradient(to right, 
                        rgba(0, 0, 0, 0),
                        rgba(0, 0, 0, 0.2),
                        rgba(0, 0, 0, 0)
                    );
                }

                .login-section,
                .info-section {
                    max-width: 100%;
                }
            }

            /* Mobile adjustments */
            @media (max-width: 768px) {
                .headerSection {
                    padding: 15px 20px;
                    align-items: center;
                    text-align: center;
                }

                .logo-section {
                    flex-direction: column;
                    align-items: center;
                    gap: 15px;
                }

                .title-section {
                    text-align: center;
                }

                .nav-section {
                    justify-content: center;
                    gap: 20px;
                }

                .role-tabs {
                    justify-content: center;
                }

                .footer-content {
                    flex-direction: column;
                    gap: 25px;
                }

                .footer-contact,
                .footer-location {
                    text-align: center;
                    width: 100%;
                }
            }

            /* Small mobile adjustments */
            @media (max-width: 480px) {
                .nav-section {
                    gap: 12px;
                    flex-direction: column;
                    width: 100%;
                }

                .nav-section a {
                    font-size: 16px;
                }

                .glassBox {
                    padding: 20px;
                }
                
                .footer-copyright {
                    font-size: 11px;
                    line-height: 1.5;
                }

                .login-btn {
                    max-width: 100%;
                }
            }
        </style>
    </head>
    <body>
        <div class="background_img">
            <img src="{{ asset('images/schoolImage.jpeg') }}" alt="School Background">
        </div>
        
        <div class="headerSection">
            <div class="logo-section">
                <img class="logo" class="logo" src="{{ asset('images/logo_home.png') }}" alt="School Logo">
                <div class="title-section">
                    <h1>Teacher Management System</h1>
                    <h2>Karandeniya Central College</h2>
                </div>
            </div>
            
            <nav class="nav-section">
                <a href="#" class="active">Login</a>
                <a href="#">Home</a>
                <a href="#">Contact Us</a>
            </nav>
        </div>
        
        <div class="content-wrapper">
            <div class="glassBox">
                <div class="login-section">
                    <div class="role-tabs">
                        <div class="role-tab active">Teacher</div>
                        <div class="role-tab">Admin</div>
                        <div class="role-tab">Principal</div>
                        <div class="role-tab">Section Head</div>
                    </div>
                    
                    <form>
                        <div class="form-group">
                            <label for="teacher-id">Teacher ID</label>
                            <input type="text" id="teacher-id" name="teacher-id" placeholder="Enter Teacher ID" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" placeholder="Enter Password" required>
                        </div>
                        <button type="submit" class="login-btn">Login</button>
                        <div class="register-link">
                            Don't have an Account? <a href="#">Register</a> Now
                        </div>
                    </form>
                </div>

                <div class="vertical-divider"></div>

                <div class="info-section">
                    <h2>Login</h2>
                    <p>Enter your Teacher credentials to log in to the system</p>
                    <div class="info-illustration">
                        <img src="{{ asset('images/login_image.png') }}">
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
                    © Copyrights Codeorbit(2025) | All Right Reserved
                </div>
            </div>
        </footer>
    </body>
</html>