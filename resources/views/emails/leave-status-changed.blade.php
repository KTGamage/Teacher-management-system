@component('mail::message')
# Leave Request {{ ucfirst($status) }}

Dear {{ $leave->teacher->user->name }},

Your leave request ({{ ucfirst($leave->leave_type) }} from {{ $leave->start_date->format('Y-m-d') }} to {{ $leave->end_date->format('Y-m-d') }}) has been **{{ $status }}**.

**Reason:** {{ $leave->reason }}

@if($remarks)
**Remarks:** {{ $remarks }}
@endif

@if ($status === 'approved')
Your request has been approved successfully.
@else
Your request has been rejected.
@endif

Thanks,  
{{ config('app.name') }}
@endcomponent
