<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teacher Management System</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --primary-color: #2c3e50;
            --secondary-color: #3498db;
            --accent-color: #e74c3c;
            --light-bg: #f8f9fa;
            --dark-text: #2c3e50;
            --light-text: #ecf0f1;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f7fa;
            color: var(--dark-text);
        }
        
        .navbar {
            background-color: var(--primary-color);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .navbar-brand {
            font-weight: bold;
            color: var(--light-text) !important;
        }
        
        .navbar-nav .nav-link {
            color: var(--light-text) !important;
            transition: color 0.3s;
        }
        
        .navbar-nav .nav-link:hover {
            color: var(--secondary-color) !important;
        }
        
        .dashboard-container {
            margin-top: 20px;
        }
        
        .welcome-section {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            margin-bottom: 20px;
        }
        
        .timetable-section {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            margin-bottom: 20px;
        }
        
        .timetable-item {
            background-color: var(--light-bg);
            padding: 12px 15px;
            margin-bottom: 10px;
            border-radius: 6px;
            border-left: 4px solid var(--secondary-color);
            transition: transform 0.2s;
        }
        
        .timetable-item:hover {
            transform: translateX(5px);
        }
        
        .card-section {
            margin-bottom: 20px;
        }
        
        .dashboard-card {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            height: 100%;
            transition: transform 0.3s;
        }
        
        .dashboard-card:hover {
            transform: translateY(-5px);
        }
        
        .card-icon {
            font-size: 2rem;
            color: var(--secondary-color);
            margin-bottom: 15px;
        }
        
        .card-title {
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 10px;
        }
        
        .card-value {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--accent-color);
        }
        
        .card-description {
            color: #7f8c8d;
            font-size: 0.9rem;
        }
        
        .teacher-dashboard {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            margin-bottom: 20px;
        }
        
        .dashboard-date {
            color: #7f8c8d;
            font-size: 0.9rem;
        }
        
        .action-buttons .btn {
            margin-right: 10px;
            margin-bottom: 10px;
        }
        
        .status-card {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            margin-bottom: 20px;
            border-left: 4px solid #2ecc71;
        }
        
        .status-title {
            font-weight: 600;
            color: var(--primary-color);
        }
        
        .status-date {
            color: #7f8c8d;
            font-size: 0.9rem;
        }
        
        .communication-section {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            margin-bottom: 20px;
            text-align: center;
        }
        
        footer {
            background-color: var(--primary-color);
            color: var(--light-text);
            padding: 20px 0;
            margin-top: 40px;
        }
        
        .footer-link {
            color: var(--light-text);
            text-decoration: none;
        }
        
        .footer-link:hover {
            color: var(--secondary-color);
        }
        
        @media (max-width: 768px) {
            .dashboard-card {
                margin-bottom: 20px;
            }
        }
    </style>
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container">
            <a class="navbar-brand" href="#">Teacher Management System</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link active" href="#"><i class="fas fa-tachometer-alt me-1"></i> Dashboard</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#"><i class="fas fa-home me-1"></i> Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#"><i class="fas fa-envelope me-1"></i> Contact Us</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="container dashboard-container">
        <!-- Welcome Section -->
        <div class="welcome-section">
            <h3>Welcome <span class="text-primary">Teacher</span></h3>
            <p class="text-muted">Here's your dashboard for today</p>
        </div>

        <div class="row">
            <!-- Left Column -->
            <div class="col-lg-8">
                <!-- Timetable Section -->
                <div class="timetable-section">
                    <h4 class="mb-4">Timetable</h4>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="timetable-item">6 A</div>
                            <div class="timetable-item">9 B</div>
                            <div class="timetable-item">10 C</div>
                            <div class="timetable-item">6 A</div>
                        </div>
                        <div class="col-md-6">
                            <div class="timetable-item">7 A</div>
                            <div class="timetable-item">8 A</div>
                            <div class="timetable-item">11 A</div>
                            <div class="timetable-item">8 B</div>
                        </div>
                    </div>
                </div>

                <!-- Cards Section -->
                <div class="row card-section">
                    <div class="col-md-4">
                        <div class="dashboard-card">
                            <div class="card-icon">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <div class="card-title">Performance</div>
                            <div class="card-value">$100M + 4.6KM</div>
                            <div class="card-description">Sciences</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="dashboard-card">
                            <div class="card-icon">
                                <i class="fas fa-flask"></i>
                            </div>
                            <div class="card-title">Laboratory</div>
                            <div class="card-value">$100M + 4.6KM</div>
                            <div class="card-description">Sciences</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="dashboard-card">
                            <div class="card-icon">
                                <i class="fas fa-book"></i>
                            </div>
                            <div class="card-title">Resources</div>
                            <div class="card-value">$100M + 4.6KM</div>
                            <div class="card-description">Sciences</div>
                        </div>
                    </div>
                </div>

                <!-- Second Row of Cards -->
                <div class="row card-section">
                    <div class="col-md-4">
                        <div class="dashboard-card">
                            <div class="card-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="card-title">Students</div>
                            <div class="card-value">$100M + 4.6KM</div>
                            <div class="card-description">Sciences</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="dashboard-card">
                            <div class="card-icon">
                                <i class="fas fa-graduation-cap"></i>
                            </div>
                            <div class="card-title">Courses</div>
                            <div class="card-value">$100M + 4.6KM</div>
                            <div class="card-description">Sciences</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="dashboard-card">
                            <div class="card-icon">
                                <i class="fas fa-award"></i>
                            </div>
                            <div class="card-title">Achievements</div>
                            <div class="card-value">$100M + 4.6KM</div>
                            <div class="card-description">Sciences</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column -->
            <div class="col-lg-4">
                <!-- Teacher Dashboard Section -->
                <div class="teacher-dashboard">
                    <h4>Teacher Dashboard</h4>
                    <p class="dashboard-date">20/06/2021</p>
                    <div class="charts-placeholder bg-light p-4 rounded text-center my-3">
                        <i class="fas fa-chart-bar fa-3x text-muted"></i>
                        <p class="mt-2 text-muted">Charts will be displayed here</p>
                    </div>
                    
                    <div class="action-buttons mt-4">
                        <button class="btn btn-primary"><i class="fas fa-paper-plane me-1"></i> Submit</button>
                        <button class="btn btn-outline-secondary"><i class="fas fa-question me-1"></i> How About It</button>
                        <button class="btn btn-outline-info"><i class="fas fa-sign-in-alt me-1"></i> Get Into</button>
                    </div>
                </div>

                <!-- Status Card -->
                <div class="status-card">
                    <h5 class="status-title">Your home was Approved</h5>
                    <p class="status-date">25 OCT 2025</p>
                </div>

                <!-- Communication Section -->
                <div class="communication-section">
                    <h5>Learn to communicate through your community</h5>
                    <p class="text-muted">Please visit the site</p>
                    <a href="http://dashboard.com" class="btn btn-outline-primary">http://dashboard.com</a>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h5>Kazanokamiya Central College</h5>
                    <p>Providing quality education since 1985</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <p>&copy; 2023 Teacher Management System. All rights reserved.</p>
                    <a href="#" class="footer-link me-3">Privacy Policy</a>
                    <a href="#" class="footer-link">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>

   
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>