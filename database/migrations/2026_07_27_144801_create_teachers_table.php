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
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('teacher_registration_number')->unique();
            $table->string('full_name');
            $table->json('qualifications')->nullable();
            $table->string('specialization')->nullable();
            $table->date('joining_date')->nullable();
            $table->string('contact_number');
            $table->text('address')->nullable();
            $table->boolean('is_section_head')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
