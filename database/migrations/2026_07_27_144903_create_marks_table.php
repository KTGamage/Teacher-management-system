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
        Schema::create('marks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('section_subject_id')->constrained('section_subject')->cascadeOnDelete();
            $table->foreignId('teacher_id')->constrained('teachers')->cascadeOnDelete();
            $table->decimal('marks', 5, 2);
            $table->enum('exam_type', ['class_test', 'mid_term', 'final_exam', 'assignment']);
            $table->date('exam_date');
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marks');
    }
};
