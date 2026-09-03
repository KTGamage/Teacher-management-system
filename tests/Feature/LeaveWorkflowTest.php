<?php

namespace Tests\Feature;

use App\Mail\LeaveRequestStatusChanged;
use App\Models\LeaveRequest;
use App\Models\Section;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;
use RuntimeException;
use Tests\TestCase;

class LeaveWorkflowTest extends TestCase
{
    use RefreshDatabase;

    private int $registrationSequence = 1;

    public function test_normal_teacher_request_is_visible_to_section_head_but_not_admin(): void
    {
        $sectionHead = $this->createTeacher(true);
        $teacher = $this->createTeacher();
        $admin = User::factory()->create(['role' => 'admin']);
        $this->createSection($sectionHead, [$teacher]);

        $this->actingAs($teacher->user)
            ->post('/teacher/leaves', $this->leavePayload())
            ->assertRedirect('/teacher/leaves');

        $leave = LeaveRequest::sole();
        $this->assertSame('pending', $leave->status);

        $this->actingAs($sectionHead->user)
            ->get('/teacher/section-leaves')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Teacher/SectionLeaves/Index')
                ->has('leaves', 1)
                ->where('leaves.0.id', $leave->id));

        $this->actingAs($admin)
            ->get('/admin/leaves')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Leaves/Index')
                ->has('leaves', 0));
    }

    public function test_only_the_correct_section_head_can_forward_a_pending_request(): void
    {
        $sectionHead = $this->createTeacher(true);
        $otherSectionHead = $this->createTeacher(true);
        $teacher = $this->createTeacher();
        $admin = User::factory()->create(['role' => 'admin']);
        $this->createSection($sectionHead, [$teacher]);
        $this->createSection($otherSectionHead);
        $leave = $this->createLeave($teacher);
        $forwardUrl = '/teacher/section-leaves/'.$leave->id.'/forward';

        $this->actingAs($otherSectionHead->user)
            ->put($forwardUrl)
            ->assertForbidden();

        $this->actingAs($sectionHead->user)
            ->put($forwardUrl, ['remarks' => 'Forwarded'])
            ->assertRedirect();

        $this->assertDatabaseHas('leave_requests', [
            'id' => $leave->id,
            'status' => 'section_approved',
            'section_head_approval' => true,
        ]);

        $this->actingAs($admin)
            ->get('/admin/leaves')
            ->assertInertia(fn (Assert $page) => $page
                ->has('leaves', 1)
                ->where('leaves.0.id', $leave->id));
    }

    public function test_section_head_decisions_email_the_requesting_teachers(): void
    {
        Mail::fake();
        $sectionHead = $this->createTeacher(true);
        $approvedTeacher = $this->createTeacher();
        $rejectedTeacher = $this->createTeacher();
        $this->createSection($sectionHead, [$approvedTeacher, $rejectedTeacher]);
        $approvedLeave = $this->createLeave($approvedTeacher);
        $rejectedLeave = $this->createLeave(
            $rejectedTeacher,
            'pending',
            '2026-11-03',
            '2026-11-04'
        );

        $approveUrl = '/teacher/section-leaves/'.$approvedLeave->id.'/approve';
        $rejectUrl = '/teacher/section-leaves/'.$rejectedLeave->id.'/reject';

        $this->actingAs($sectionHead->user)
            ->put($approveUrl, ['remarks' => 'Approved locally'])
            ->assertRedirect();
        $this->actingAs($sectionHead->user)
            ->put($rejectUrl, ['remarks' => 'Coverage unavailable'])
            ->assertRedirect();

        $this->assertDatabaseHas('leave_requests', [
            'id' => $approvedLeave->id,
            'status' => 'admin_approved',
            'admin_approval' => false,
            'admin_approval_date' => null,
        ]);
        $this->assertDatabaseHas('leave_requests', [
            'id' => $rejectedLeave->id,
            'status' => 'rejected',
            'section_head_approval' => false,
        ]);

        Mail::assertSent(LeaveRequestStatusChanged::class, function ($mail) use ($approvedTeacher) {
            if ($mail->status !== 'approved' || ! $mail->hasTo($approvedTeacher->user->email)) {
                return false;
            }

            $mail->assertSeeInHtml('Approved locally');

            return true;
        });
        Mail::assertSent(LeaveRequestStatusChanged::class, function ($mail) use ($rejectedTeacher) {
            if ($mail->status !== 'rejected' || ! $mail->hasTo($rejectedTeacher->user->email)) {
                return false;
            }

            $mail->assertSeeInHtml('Coverage unavailable');

            return true;
        });
    }

    public function test_admin_only_decides_forwarded_or_section_head_requests_and_emails_teacher(): void
    {
        Mail::fake();
        $admin = User::factory()->create(['role' => 'admin']);
        $sectionHead = $this->createTeacher(true);
        $teacher = $this->createTeacher();
        $this->createSection($sectionHead, [$teacher]);
        $pendingTeacherLeave = $this->createLeave($teacher);
        $sectionHeadLeave = $this->createLeave(
            $sectionHead,
            'pending',
            '2026-11-05',
            '2026-11-06'
        );

        $teacherApproveUrl = '/admin/leaves/'.$pendingTeacherLeave->id.'/approve';
        $headRejectUrl = '/admin/leaves/'.$sectionHeadLeave->id.'/reject';

        $this->actingAs($admin)
            ->put($teacherApproveUrl)
            ->assertStatus(409);

        $pendingTeacherLeave->update([
            'status' => 'section_approved',
            'section_head_approval' => true,
            'section_head_approval_date' => now(),
        ]);

        $this->actingAs($admin)
            ->put($teacherApproveUrl, ['remarks' => 'Approved by admin'])
            ->assertRedirect();
        $this->actingAs($admin)
            ->put($headRejectUrl, ['remarks' => 'Rejected by admin'])
            ->assertRedirect();

        $this->assertDatabaseHas('leave_requests', [
            'id' => $pendingTeacherLeave->id,
            'status' => 'admin_approved',
            'admin_approval' => true,
        ]);
        $this->assertDatabaseHas('leave_requests', [
            'id' => $sectionHeadLeave->id,
            'status' => 'rejected',
            'admin_approval' => false,
        ]);

        Mail::assertSent(LeaveRequestStatusChanged::class, function ($mail) use ($teacher) {
            return $mail->status === 'approved' and $mail->hasTo($teacher->user->email);
        });
        Mail::assertSent(LeaveRequestStatusChanged::class, function ($mail) use ($sectionHead) {
            return $mail->status === 'rejected' and $mail->hasTo($sectionHead->user->email);
        });
    }

    public function test_section_head_cannot_review_own_request_or_replay_a_decision(): void
    {
        $sectionHead = $this->createTeacher(true);
        $teacher = $this->createTeacher();
        $this->createSection($sectionHead, [$teacher]);
        $ownLeave = $this->createLeave($sectionHead);
        $decidedLeave = $this->createLeave(
            $teacher,
            'rejected',
            '2026-11-07',
            '2026-11-08'
        );

        $this->actingAs($sectionHead->user)
            ->put('/teacher/section-leaves/'.$ownLeave->id.'/approve')
            ->assertForbidden();
        $this->actingAs($sectionHead->user)
            ->put('/teacher/section-leaves/'.$decidedLeave->id.'/forward')
            ->assertStatus(409);
    }

    public function test_leave_dates_times_and_overlaps_are_validated(): void
    {
        $sectionHead = $this->createTeacher(true);
        $teacher = $this->createTeacher();
        $this->createSection($sectionHead, [$teacher]);

        $invalidTimes = $this->leavePayload();
        $invalidTimes['start_date'] = '2026-11-01';
        $invalidTimes['end_date'] = '2026-11-01';
        $invalidTimes['start_time'] = '15:00';
        $invalidTimes['end_time'] = '09:00';

        $this->actingAs($teacher->user)
            ->post('/teacher/leaves', $invalidTimes)
            ->assertSessionHasErrors('end_time');

        $this->createLeave($teacher);

        $this->actingAs($teacher->user)
            ->post('/teacher/leaves', $this->leavePayload())
            ->assertSessionHasErrors('start_date');
    }

    public function test_decision_rolls_back_when_email_delivery_fails(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $sectionHead = $this->createTeacher(true);
        $teacher = $this->createTeacher();
        $this->createSection($sectionHead, [$teacher]);
        $leave = $this->createLeave($teacher, 'section_approved');

        Mail::shouldReceive('to')
            ->once()
            ->andThrow(new RuntimeException('SMTP unavailable'));

        try {
            $this->withoutExceptionHandling()
                ->actingAs($admin)
                ->put('/admin/leaves/'.$leave->id.'/approve');
            $this->fail('Expected the simulated SMTP failure.');
        } catch (RuntimeException $exception) {
            $this->assertSame('SMTP unavailable', $exception->getMessage());
        }

        $this->assertDatabaseHas('leave_requests', [
            'id' => $leave->id,
            'status' => 'section_approved',
            'admin_approval' => false,
            'admin_approval_date' => null,
        ]);
        $this->assertDatabaseMissing('activities', [
            'type' => 'Leave Approved by Admin',
        ]);
    }

    private function createTeacher(bool $isSectionHead = false): Teacher
    {
        $user = User::factory()->create(['role' => 'teacher']);
        $sequence = $this->registrationSequence++;

        return Teacher::create([
            'user_id' => $user->id,
            'teacher_registration_number' => 'T'.$sequence,
            'full_name' => 'Teacher '.$sequence,
            'contact_number' => '07000000'.$sequence,
            'is_section_head' => $isSectionHead,
        ]);
    }

    /** @param array<int, Teacher> $teachers */
    private function createSection(Teacher $head, array $teachers = []): Section
    {
        $section = Section::create([
            'name' => 'Section '.$head->id,
            'code' => 'S'.$head->id,
            'academic_year' => '2026',
            'section_head_id' => $head->id,
            'is_active' => true,
        ]);
        $teacherIds = array_map(fn (Teacher $teacher) => $teacher->id, $teachers);
        $section->teachers()->attach($teacherIds);

        return $section;
    }

    private function createLeave(
        Teacher $teacher,
        string $status = 'pending',
        string $startDate = '2026-11-01',
        string $endDate = '2026-11-02'
    ): LeaveRequest {
        return LeaveRequest::create([
            'teacher_id' => $teacher->id,
            'leave_type' => 'annual',
            'start_date' => $startDate,
            'end_date' => $endDate,
            'reason' => 'Family commitment',
            'status' => $status,
        ]);
    }

    /** @return array<string, string> */
    private function leavePayload(): array
    {
        return [
            'leave_type' => 'annual',
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-02',
            'reason' => 'Family commitment',
        ];
    }
}
