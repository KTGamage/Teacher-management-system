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
        Schema::table('timetable_slots', function (Blueprint $table) {
             $table->foreignId('class_room_id')->nullable()->after('section_subject_id')->constrained()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('timetable_slots', function (Blueprint $table) {
            $table->dropForeign(['class_room_id']);
            $table->dropColumn('class_room_id');
        });
    }
};
