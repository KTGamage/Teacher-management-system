@component('mail::message')
# Leave Request {{ ucfirst($status) }}

Dear {{ $leave->teacher->user->name }},

Your leave request ({{ $leave->leave_type }} from {{ $leave->start_date }} to {{ $leave->end_date }}) has been **{{ $status }}**.

**Reason:** {{ $leave->reason }}

@if ($status === 'approved')
Your request has been approved successfully.
@else
Your request has been rejected.
@endif

Thanks,  
{{ config('app.name') }}
@endcomponent