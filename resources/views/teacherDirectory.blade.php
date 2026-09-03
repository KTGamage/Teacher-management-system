<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Teacher Directory | Teacher Management System</title>
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

            .headerSection {
                position: relative;
                z-index: 2;
                width: 100%;
                min-height: 120px;
                padding: 20px 40px;
                background: rgba(255, 255, 255, 0.85);
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 20px;
            }

            .logo-section {
                display: flex;
                align-items: center;
                gap: 20px;
            }

            .logo {
                width: 80px;
                height: 80px;
                object-fit: contain;
                background: white;
                border-radius: 50%;
                padding: 5px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }

            .title-section h1 {
                color: #000;
                font-size: clamp(20px, 3vw, 32px);
                font-weight: 700;
                margin: 0;
                line-height: 1.2;
            }

            .title-section h2 {
                color: #000;
                font-size: clamp(16px, 2vw, 22px);
                font-weight: 500;
                margin: 0;
                line-height: 1.3;
            }

            .nav-section {
                display: flex;
                align-items: center;
                gap: 40px;
            }

            .nav-section a {
                color: #000;
                text-decoration: none;
                font-size: clamp(16px, 2vw, 20px);
                font-weight: 600;
                position: relative;
                padding-bottom: 5px;
                transition: color 0.3s ease;
            }

            .nav-section a:hover {
                color: #dc3545;
            }

            .nav-section a.active::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background-color: #dc3545;
                border-radius: 2px;
            }

            .content-wrapper {
                position: relative;
                z-index: 1;
                flex: 1;
                padding: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .glassBox {
                width: 90%;
                max-width: 1200px;
                min-height: 72vh;
                padding: clamp(24px, 4vw, 42px);
                border-radius: 16px;
                background: rgba(255, 255, 255, 0.5);
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 30px rgba(0,0,0,0.35);
                color: #000;
                border: 1px solid rgba(255,255,255,0.18);
            }

            .page-heading {
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                gap: 20px;
                margin-bottom: 26px;
                border-bottom: 2px solid rgba(0,0,0,0.12);
                padding-bottom: 18px;
            }

            .page-heading h2 {
                color: #000;
                font-size: clamp(24px, 3vw, 34px);
                font-weight: 700;
                margin: 0 0 6px 0;
            }

            .page-heading p {
                color: #333;
                font-size: clamp(14px, 2vw, 17px);
                line-height: 1.5;
                margin: 0;
            }

            .directory-count {
                background: #0066ff;
                color: #fff;
                border-radius: 30px;
                padding: 12px 22px;
                font-size: 16px;
                font-weight: 700;
                white-space: nowrap;
            }

            .teacher-grid {
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 18px;
            }

            .teacher-card {
                background: rgba(255, 255, 255, 0.72);
                border-radius: 15px;
                padding: 22px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.12);
                border-left: 5px solid #0066ff;
                transition: transform 0.25s ease, box-shadow 0.25s ease;
            }

            .teacher-card:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 24px rgba(0,0,0,0.18);
            }

            .teacher-card.section-head {
                border-left-color: #dc3545;
            }

            .teacher-card h3 {
                color: #000;
                font-size: 20px;
                font-weight: 700;
                margin-bottom: 6px;
            }

            .subject {
                color: #dc3545;
                font-size: 15px;
                font-weight: 700;
                margin-bottom: 16px;
            }

            .teacher-detail {
                color: #333;
                font-size: 15px;
                line-height: 1.6;
                margin-bottom: 6px;
            }

            .teacher-detail span {
                color: #000;
                font-weight: 700;
            }

            .action-row {
                display: flex;
                justify-content: flex-end;
                margin-top: 26px;
            }

            .back-btn {
                min-width: 160px;
                padding: 13px 24px;
                background: transparent;
                color: #0066ff;
                border: 2px solid #0066ff;
                border-radius: 30px;
                font-size: 16px;
                font-weight: 700;
                text-decoration: none;
                text-align: center;
                transition: all 0.3s ease;
            }

            .back-btn:hover {
                background: rgba(0, 102, 255, 0.1);
                color: #0066ff;
                transform: translateY(-2px) scale(1.02);
                box-shadow: 0 4px 12px rgba(0, 102, 255, 0.15);
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

            .footer-location {
                text-align: right;
                flex: 1;
            }

            .footer-contact p,
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

            @media (max-width: 992px) {
                .teacher-grid {
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                }
            }

            @media (max-width: 768px) {
                .headerSection {
                    padding: 15px 20px;
                    justify-content: center;
                    text-align: center;
                }

                .logo-section {
                    flex-direction: column;
                    width: 100%;
                    justify-content: center;
                }

                .nav-section {
                    gap: 20px;
                    width: 100%;
                    justify-content: center;
                }

                .page-heading {
                    align-items: flex-start;
                    flex-direction: column;
                }

                .teacher-grid {
                    grid-template-columns: 1fr;
                }

                .footer-content {
                    flex-direction: column;
                    gap: 30px;
                }

                .footer-contact,
                .footer-location {
                    text-align: center;
                }
            }

            @media (max-width: 480px) {
                .logo {
                    width: 60px;
                    height: 60px;
                }

                .nav-section {
                    gap: 15px;
                }

                .glassBox {
                    width: 95%;
                    padding: 20px;
                }

                .back-btn {
                    width: 100%;
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

        <div class="headerSection">
            <div class="logo-section">
                <img class="logo" src="{{ asset('images/logo.png') }}" alt="School Logo">
                <div class="title-section">
                    <h1>Teacher Management System</h1>
                    <h2>Karandeniya Central College</h2>
                </div>
            </div>

            <nav class="nav-section">
                <a href="{{ url('/') }}">Home</a>
                <a href="{{ route('login') }}">Login</a>
                <a href="#" class="active">Directory</a>
            </nav>
        </div>

        <div class="content-wrapper">
            <div class="glassBox">
                <div class="page-heading">
                    <div>
                        <h2>Teacher Directory</h2>
                        <p>View department teachers, assigned classes, and contact details.</p>
                    </div>
                    <div class="directory-count">06 Teachers</div>
                </div>

                <div class="teacher-grid">
                    <div class="teacher-card section-head">
                        <h3>Mrs. Nadeesha Perera</h3>
                        <div class="subject">Section Head</div>
                        <div class="teacher-detail"><span>Department :</span> Science</div>
                        <div class="teacher-detail"><span>Classes :</span> 10 A, 11 B</div>
                        <div class="teacher-detail"><span>Email :</span> nadeesha@school.lk</div>
                    </div>

                    <div class="teacher-card">
                        <h3>Mr. Ravindu Silva</h3>
                        <div class="subject">Science</div>
                        <div class="teacher-detail"><span>Department :</span> Science</div>
                        <div class="teacher-detail"><span>Classes :</span> 6 A, 8 B</div>
                        <div class="teacher-detail"><span>Email :</span> ravindu@school.lk</div>
                    </div>

                    <div class="teacher-card">
                        <h3>Mrs. Ishara Fernando</h3>
                        <div class="subject">Mathematics</div>
                        <div class="teacher-detail"><span>Department :</span> Mathematics</div>
                        <div class="teacher-detail"><span>Classes :</span> 7 A, 9 C</div>
                        <div class="teacher-detail"><span>Email :</span> ishara@school.lk</div>
                    </div>

                    <div class="teacher-card">
                        <h3>Mr. Kasun Jayasinghe</h3>
                        <div class="subject">English</div>
                        <div class="teacher-detail"><span>Department :</span> Languages</div>
                        <div class="teacher-detail"><span>Classes :</span> 6 B, 10 C</div>
                        <div class="teacher-detail"><span>Email :</span> kasun@school.lk</div>
                    </div>

                    <div class="teacher-card">
                        <h3>Mrs. Dulani Weerasinghe</h3>
                        <div class="subject">History</div>
                        <div class="teacher-detail"><span>Department :</span> Social Studies</div>
                        <div class="teacher-detail"><span>Classes :</span> 8 A, 9 B</div>
                        <div class="teacher-detail"><span>Email :</span> dulani@school.lk</div>
                    </div>

                    <div class="teacher-card">
                        <h3>Mr. Chamara Kumara</h3>
                        <div class="subject">ICT</div>
                        <div class="teacher-detail"><span>Department :</span> Technology</div>
                        <div class="teacher-detail"><span>Classes :</span> 10 A, 11 A</div>
                        <div class="teacher-detail"><span>Email :</span> chamara@school.lk</div>
                    </div>
                </div>

                <div class="action-row">
                    <a href="{{ url('/') }}" class="back-btn">Back to Home</a>
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
                    &copy; 2025 Karandeniya Central College - Teacher Management System
                </div>
            </div>
        </footer>
    </body>
</html>
