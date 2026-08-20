<!DOCTYPE html>
<html>
<head>
    <title>Student Marks</title>
    <style>
        body { font-family: 'Manrope', sans-serif; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>Marks Report</h1>
    <p>Student: {{ $student->full_name }} ({{ $student->registration_number }})</p>
    <table>
        <thead>
            <tr>
                <th>Subject</th>
                <th>Exam Type</th>
                <th>Date</th>
                <th>Marks</th>
                <th>Remarks</th>
            </tr>
        </thead>
        <tbody>
            @foreach($marks as $mark)
                <tr>
                    <td>{{ $mark->sectionSubject->subject->name }}</td>
                    <td>{{ $mark->exam_type }}</td>
                    <td>{{ $mark->exam_date }}</td>
                    <td>{{ $mark->marks }}</td>
                    <td>{{ $mark->remarks ?? '-' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>