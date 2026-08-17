<?php

namespace Database\Seeders;

use App\Models\Section;
use Illuminate\Database\Seeder;

class SectionSeeder extends Seeder
{
    public function run(): void
    {
        Section::create([
            'name' => 'Grade 10A',
            'code' => '10A',
            'academic_year' => '2024',
            'section_head_id' => 1, // First teacher from TeacherSeeder
            'is_active' => true,
        ]);

        Section::create([
            'name' => 'Grade 10B',
            'code' => '10B',
            'academic_year' => '2024',
            'section_head_id' => 2, // Second teacher
            'is_active' => true,
        ]);

        Section::create([
            'name' => 'Grade 11A',
            'code' => '11A',
            'academic_year' => '2024',
            'section_head_id' => 3, // Third teacher
            'is_active' => true,
        ]);

        Section::create([
            'name' => 'Grade 11B',
            'code' => '11B',
            'academic_year' => '2024',
            'section_head_id' => 4, // Fourth teacher
            'is_active' => true,
        ]);

        Section::create([
            'name' => 'Grade 12A',
            'code' => '12A',
            'academic_year' => '2024',
            'section_head_id' => 1, // First teacher
            'is_active' => true,
        ]);

        Section::create([
            'name' => 'Grade 13A',
            'code' => '13A',
            'academic_year' => '2024',
            'section_head_id' => 2, // Second teacher
            'is_active' => true,
        ]);
    }
}
