<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('teachers')->cascadeOnDelete();
            $table->enum('leave_type', ['annual', 'sick', 'casual', 'duty', 'other']);
            $table->date('start_date');
            $table->date('end_date');
            $table->text('reason');
            $table->enum('status', ['pending', 'section_approved', 'admin_approved', 'rejected'])->default('pending');
            $table->boolean('section_head_approval')->default(false);
            $table->timestamp('section_head_approval_date')->nullable();
            $table->text('section_head_remarks')->nullable();
            $table->boolean('admin_approval')->default(false);
            $table->timestamp('admin_approval_date')->nullable();
            $table->text('admin_remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
    }
};
