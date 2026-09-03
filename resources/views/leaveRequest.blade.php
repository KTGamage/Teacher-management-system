<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Leave Request | Teacher Management System</title>
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

            .headerSection {
                position: relative;
                z-index: 2;
                width: 100%;
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

            .content-wrapper {
                position: relative;
                z-index: 1;
                flex: 1;
                padding: clamp(15px, 3vw, 20px);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .glassBox {
                width: 100%;
                max-width: 1200px;
                min-height: clamp(520px, 78vh, 760px);
                border-radius: clamp(16px, 2vw, 24px);
                background: rgba(255, 255, 255, 0.4);
                backdrop-filter: blur(15px);
                box-shadow: 0 8px 30px rgba(0,0,0,0.35);
                border: 1px solid rgba(255,255,255,0.18);
                display: flex;
                overflow: hidden;
            }

            .form-section {
                flex: 2;
                padding: clamp(30px, 5vw, 55px);
                background: rgba(255, 255, 255, 0.24);
            }

            .summary-section {
                flex: 1;
                padding: clamp(30px, 4vw, 45px);
                display: flex;
                flex-direction: column;
                gap: 20px;
                justify-content: center;
            }

            .section-title {
                font-size: clamp(22px, 3vw, 30px);
                font-weight: 700;
                color: #000;
                margin-bottom: 8px;
            }

            .section-subtitle {
                color: #333;
                font-size: clamp(14px, 1.8vw, 16px);
                line-height: 1.6;
                margin-bottom: 28px;
            }

            .form-grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 20px;
            }

            .form-group {
                display: flex;
                flex-direction: column;
                gap: 9px;
            }

            .form-group.full-width {
                grid-column: 1 / -1;
            }

            .form-group label {
                color: #000;
                font-size: 15px;
                font-weight: 700;
            }

            .form-group input,
            .form-group select,
            .form-group textarea {
                width: 100%;
                padding: 13px 16px;
                border: none;
                border-radius: 24px;
                background: rgba(255, 255, 255, 0.9);
                color: #333;
                font-size: 15px;
                transition: all 0.3s ease;
            }

            .form-group textarea {
                min-height: 130px;
                resize: vertical;
                border-radius: 18px;
            }

            .form-group input:focus,
            .form-group select:focus,
            .form-group textarea:focus {
                outline: none;
                background: #fff;
                box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.16);
            }

            .form-actions {
                display: flex;
                align-items: center;
                gap: 15px;
                flex-wrap: wrap;
                margin-top: 26px;
            }

            .submit-btn,
            .back-btn {
                min-width: 160px;
                padding: 13px 24px;
                border: none;
                border-radius: 30px;
                font-size: 16px;
                font-weight: 700;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                transition: all 0.3s ease;
                cursor: pointer;
            }

            .submit-btn {
                background: #0066ff;
                color: #fff;
            }

            .submit-btn:hover {
                background: #0052cc;
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 102, 255, 0.35);
            }

            .back-btn {
                background: transparent;
                color: #0066ff;
                border: 2px solid #0066ff;
            }

            .back-btn:hover {
                background: rgba(0, 102, 255, 0.1);
                transform: translateY(-2px);
            }

            .summary-card {
                background: rgba(255, 255, 255, 0.7);
                border-radius: 15px;
                padding: 22px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                border-left: 5px solid #0066ff;
            }

            .summary-card.approved {
                border-left-color: #28a745;
            }

            .summary-card.pending {
                border-left-color: #dc3545;
            }

            .summary-label {
                color: #666;
                font-size: 14px;
                margin-bottom: 4px;
            }

            .summary-value {
                color: #000;
                font-size: 20px;
                font-weight: 700;
            }

            .notice-box {
                color: #333;
                font-size: 15px;
                line-height: 1.6;
                background: rgba(255, 255, 255, 0.35);
                border-radius: 15px;
                padding: 20px;
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

            .footer-contact,
            .footer-location {
                flex: 1;
                min-width: 200px;
            }

            .footer-location {
                text-align: right;
            }

            .footer-contact p,
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

                .logo-section,
                .nav-section {
                    width: 100%;
                }

                .glassBox {
                    flex-direction: column;
                }

                .summary-section {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                }

                .notice-box {
                    grid-column: 1 / -1;
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
                }

                .title-section {
                    text-align: center;
                    margin-left: 0;
                    padding-top: 70px;
                }

                .nav-section {
                    justify-content: center;
                    gap: 20px;
                }

                .form-grid,
                .summary-section {
                    grid-template-columns: 1fr;
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

            @media (max-width: 480px) {
                .nav-section {
                    gap: 12px;
                    flex-direction: column;
                    width: 100%;
                }

                .submit-btn,
                .back-btn {
                    width: 100%;
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
                <a href="{{ url('/teacher-dashboard') }}">Dashboard</a>
                <a href="{{ url('/') }}">Home</a>
                <a href="#" class="active">Leave Form</a>
            </nav>
        </div>

        <div class="content-wrapper">
            <div class="glassBox">
                <section class="form-section">
                    <h2 class="section-title">New Leave Request</h2>
                    <p class="section-subtitle">Complete the details below to prepare a leave request for review.</p>

                    <form>
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="teacher-name">Teacher Name</label>
                                <input type="text" id="teacher-name" name="teacher-name" value="Mr. Ravindu">
                            </div>

                            <div class="form-group">
                                <label for="teacher-id">Teacher ID</label>
                                <input type="text" id="teacher-id" name="teacher-id" placeholder="Enter Teacher ID">
                            </div>

                            <div class="form-group">
                                <label for="leave-type">Leave Type</label>
                                <select id="leave-type" name="leave-type">
                                    <option>Medical Leave</option>
                                    <option>Casual Leave</option>
                                    <option>Duty Leave</option>
                                    <option>Personal Leave</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="cover-teacher">Covering Teacher</label>
                                <input type="text" id="cover-teacher" name="cover-teacher" placeholder="Enter teacher name">
                            </div>

                            <div class="form-group">
                                <label for="start-date">Start Date</label>
                                <input type="date" id="start-date" name="start-date">
                            </div>

                            <div class="form-group">
                                <label for="end-date">End Date</label>
                                <input type="date" id="end-date" name="end-date">
                            </div>

                            <div class="form-group full-width">
                                <label for="reason">Reason</label>
                                <textarea id="reason" name="reason" placeholder="Write the reason for your leave request"></textarea>
                            </div>
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="submit-btn">
                                <i class="fas fa-paper-plane"></i> Submit Request
                            </button>
                            <a href="{{ url('/teacher-dashboard') }}" class="back-btn">
                                <i class="fas fa-arrow-left"></i> Back
                            </a>
                        </div>
                    </form>
                </section>

                <aside class="summary-section">
                    <div class="summary-card approved">
                        <div class="summary-label">Approved Leaves</div>
                        <div class="summary-value">04</div>
                    </div>

                    <div class="summary-card pending">
                        <div class="summary-label">Pending Requests</div>
                        <div class="summary-value">01</div>
                    </div>

                    <div class="summary-card">
                        <div class="summary-label">Available Balance</div>
                        <div class="summary-value">08 Days</div>
                    </div>

                    <div class="notice-box">
                        Leave requests should be submitted before the school day begins. Please add a covering teacher when lessons are already scheduled.
                    </div>
                </aside>
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
                    &copy; Copyrights Codeorbit(2025) | All Right Reserved
                </div>
            </div>
        </footer>

        <script>
            document.querySelector('form').addEventListener('submit', function(event) {
                event.preventDefault();
                alert('Leave request prepared for submission.');
            });
        </script>
    </body>
</html>
