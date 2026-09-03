<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Teacher Management System</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

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
                max-width: 1400px;
                min-height: clamp(500px, 80vh, 800px);
                padding: 0;
                border-radius: clamp(16px, 2vw, 24px);
                background: rgba(255, 255, 255, 0.4);
                backdrop-filter: blur(15px);
                box-shadow: 0 8px 30px rgba(0,0,0,0.35);
                border: 1px solid rgba(255,255,255,0.18);
                display: flex;
                overflow: hidden;
            }

            /* Dashboard specific styles */
            .dashboard-container {
                width: 100%;
                padding: clamp(30px, 5vw, 60px);
                display: flex;
                flex-direction: column;
            }

            .welcome-section {
                margin-bottom: 30px;
            }

            .welcome-text {
                font-size: clamp(20px, 3vw, 28px);
                font-weight: 600;
                color: #000;
                margin-bottom: 5px;
            }

            .teacher-name {
                font-size: clamp(18px, 2.5vw, 24px);
                font-weight: 700;
                color: #0066ff;
            }

            .dashboard-content {
                display: flex;
                flex: 1;
                gap: 30px;
            }

            .timetable-section {
                flex: 2;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 15px;
                padding: 25px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }

            .sidebar-section {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            .dashboard-card {
                background: rgba(255, 255, 255, 0.3);
                border-radius: 15px;
                padding: 25px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }

            .section-title {
                font-size: clamp(18px, 2.5vw, 24px);
                font-weight: 700;
                color: #000;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 2px solid rgba(0,0,0,0.1);
            }

            .timetable-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 15px;
            }

            .timetable-item {
                background: rgba(255, 255, 255, 0.7);
                border-radius: 10px;
                padding: 15px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                border-left: 4px solid #0066ff;
            }

            .class-name {
                font-weight: 700;
                font-size: 1.1rem;
                color: #000;
                margin-bottom: 5px;
            }

            .class-time {
                color: #666;
                font-size: 0.9rem;
                margin-bottom: 5px;
            }

            .class-subject {
                font-weight: 600;
                color: #dc3545;
            }

            .dashboard-date {
                color: #666;
                font-size: 1rem;
                margin-bottom: 20px;
            }

            .action-buttons {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .dashboard-btn {
                padding: 12px 20px;
                border: none;
                border-radius: 30px;
                font-size: 16px;
                font-weight: 600;
                text-decoration: none;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }

            .btn-logout {
                background: #dc3545;
                color: white;
            }

            .btn-logout:hover {
                background: #c82333;
                transform: translateY(-2px);
            }

            .btn-submit {
                background: #0066ff;
                color: white;
            }

            .btn-submit:hover {
                background: #0052cc;
                transform: translateY(-2px);
            }

            .btn-leave {
                background: #28a745;
                color: white;
            }

            .btn-leave:hover {
                background: #218838;
                transform: translateY(-2px);
            }

            .btn-click {
                background: transparent;
                color: #0066ff;
                border: 2px solid #0066ff;
            }

            .btn-click:hover {
                background: rgba(0, 102, 255, 0.1);
                transform: translateY(-2px);
            }

            .status-card {
                background: rgba(255, 255, 255, 0.7);
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                border-left: 5px solid #28a745;
            }

            .status-title {
                font-weight: 700;
                color: #000;
                margin-bottom: 5px;
            }

            .status-date {
                color: #666;
                font-size: 0.9rem;
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

                .dashboard-content {
                    flex-direction: column;
                }

                .timetable-section, .sidebar-section {
                    width: 100%;
                }
            }

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

                .timetable-grid {
                    grid-template-columns: 1fr;
                }

                .footer-content {
                    flex-direction: column;
                    gap: 25px;
                }

                .footer-contact, .footer-location {
                    text-align: center;
                    width: 100%;
                }
            }

            @media (max-width: 480px) {
                .nav-section {
                    gap: 12px;
                    flex-direction: column;
                    width: 100%;
                }

                .nav-section a {
                    font-size: 16px;
                }
                
                .footer-copyright {
                    font-size: 11px;
                    line-height: 1.5;
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
                <img class="logo" src="{{ asset('images/logo_home.png') }}" alt="School Logo">
                <div class="title-section">
                    <h1>Teacher Management System</h1>
                    <h2>Karandeniya Central College</h2>
                </div>
            </div>
            
            <nav class="nav-section">
                <a href="#" class="active">Dashboard</a>
                <a href="#">Home</a>
                <a href="#">Contact Us</a>
            </nav>
        </div>
        
        <div class="content-wrapper">
            <div class="glassBox">
                <div class="dashboard-container">
                    <!-- Welcome Section -->
                    <div class="welcome-section">
                        <div class="welcome-text">Welcome</div>
                        <div class="teacher-name">Mr. Ravindu</div>
                    </div>

                    <div class="dashboard-content">
                        <!-- Timetable Section -->
                        <div class="timetable-section">
                            <h2 class="section-title">Timetable</h2>
                            <div class="timetable-grid">
                                <div class="timetable-item">
                                    <div class="class-name">6 A</div>
                                    <div class="class-time">8.00AM - 8.45AM</div>
                                    <div class="class-subject">Science</div>
                                </div>
                                <div class="timetable-item">
                                    <div class="class-name">9 B</div>
                                    <div class="class-time">8.00AM - 8.45AM</div>
                                    <div class="class-subject">Science</div>
                                </div>
                                <div class="timetable-item">
                                    <div class="class-name">10 C</div>
                                    <div class="class-time">8.00AM - 8.45AM</div>
                                    <div class="class-subject">Science</div>
                                </div>
                                <div class="timetable-item">
                                    <div class="class-name">6 A</div>
                                    <div class="class-time">8.00AM - 8.45AM</div>
                                    <div class="class-subject">Science</div>
                                </div>
                                <div class="timetable-item">
                                    <div class="class-name">7 A</div>
                                    <div class="class-time">8.00AM - 8.45AM</div>
                                    <div class="class-subject">Science</div>
                                </div>
                                <div class="timetable-item">
                                    <div class="class-name">8 A</div>
                                    <div class="class-time">8.00AM - 8.45AM</div>
                                    <div class="class-subject">Science</div>
                                </div>
                                <div class="timetable-item">
                                    <div class="class-name">11 A</div>
                                    <div class="class-time">8.00AM - 8.45AM</div>
                                    <div class="class-subject">Science</div>
                                </div>
                                <div class="timetable-item">
                                    <div class="class-name">8 B</div>
                                    <div class="class-time">8.00AM - 8.45AM</div>
                                    <div class="class-subject">Science</div>
                                </div>
                            </div>
                        </div>

                        <!-- Sidebar Section -->
                        <div class="sidebar-section">
                            <!-- Teacher Dashboard Card -->
                            <div class="dashboard-card">
                                <h2 class="section-title">Teacher Dashboard</h2>
                                <div class="dashboard-date">28 Oct 2025</div>
                                
                                <div class="action-buttons">
                                    <button class="dashboard-btn btn-logout">
                                        <i class="fas fa-sign-out-alt"></i> Logout
                                    </button>
                                    <button class="dashboard-btn btn-submit">
                                        <i class="fas fa-paper-plane"></i> Submit
                                    </button>
                                    <a href="{{ route('leave.request') }}" class="dashboard-btn btn-leave">
                                        <i class="fas fa-file-alt"></i> New Leave Form
                                    </a>
                                    <button class="dashboard-btn btn-click">
                                        <i class="fas fa-hand-pointer"></i> Click Here
                                    </button>
                                </div>
                            </div>

                            <!-- Status Card -->
                            <div class="status-card">
                                <div class="status-title">Your leave was Approved</div>
                                <div class="status-date">28 OCT 2025</div>
                            </div>
                        </div>
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

        <script>
            // Simple script for button interactions
            document.querySelector('.btn-logout').addEventListener('click', function() {
                alert('Logging out...');
                // In a real application, this would redirect to login page
            });

            document.querySelector('.btn-submit').addEventListener('click', function() {
                alert('Submitting...');
            });

            document.querySelector('.btn-click').addEventListener('click', function() {
                alert('Button clicked!');
            });
        </script>
    </body>
</html>
