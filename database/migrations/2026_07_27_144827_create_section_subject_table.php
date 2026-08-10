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
        Schema::create('section_subject', function (Blueprint $table) {
             $table->id();
            $table->foreignId('section_id')
                  ->constrained()
                  ->cascadeOnDelete();
            $table->foreignId('subject_id')
                  ->constrained()
                  ->cascadeOnDelete();
            $table->foreignId('teacher_id')
                  ->nullable()
                  ->constrained('teachers')
                  ->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            
            $table->unique(['section_id', 'subject_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('section_subject');
    }
};
