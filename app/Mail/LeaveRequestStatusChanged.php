<?php

namespace App\Mail;

use App\Models\LeaveRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class LeaveRequestStatusChanged extends Mailable
{
    use Queueable, SerializesModels;

    public $leave;

    public $status;

    public $remarks;

    public function __construct(LeaveRequest $leave, string $status, ?string $remarks = null)
    {
        $this->leave = $leave;
        $this->status = $status;
        $this->remarks = $remarks;
    }

    public function build(): self
    {
        return $this->subject('Leave Request '.ucfirst($this->status))
            ->markdown('emails.leave-status-changed');
    }
}
