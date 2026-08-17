<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    public function run(): void
    {
        $subjects = [
            ['name' => 'Mathematics', 'code' => 'MATH'],
            ['name' => 'Physics', 'code' => 'PHY'],
            ['name' => 'Chemistry', 'code' => 'CHEM'],
            ['name' => 'Biology', 'code' => 'BIO'],
            ['name' => 'Combined Mathematics', 'code' => 'CMATH'],
            ['name' => 'ICT', 'code' => 'ICT'],
            ['name' => 'English', 'code' => 'ENG'],
            ['name' => 'Sinhala', 'code' => 'SIN'],
            ['name' => 'History', 'code' => 'HIST'],
            ['name' => 'Geography', 'code' => 'GEO'],
            ['name' => 'Economics', 'code' => 'ECON'],
            ['name' => 'Accounting', 'code' => 'ACC'],
            ['name' => 'Business Studies', 'code' => 'BUS'],
            ['name' => 'Science', 'code' => 'SCI'],
            ['name' => 'Art', 'code' => 'ART'],
        ];

        foreach ($subjects as $subject) {
            Subject::create($subject);
        }

        // Attach subjects to sections
        // Grade 10A subjects (Science stream)
        $section10A = \App\Models\Section::where('name', 'Grade 10A')->first();
        $section10A->subjects()->attach([1, 2, 3, 6, 7, 8]); // Math, Physics, Chemistry, ICT, English, Sinhala

        // Grade 10B subjects (Commerce stream)
        $section10B = \App\Models\Section::where('name', 'Grade 10B')->first();
        $section10B->subjects()->attach([1, 7, 8, 11, 12, 13]); // Math, English, Sinhala, Economics, Accounting, Business

        // Grade 11A subjects (Science stream)
        $section11A = \App\Models\Section::where('name', 'Grade 11A')->first();
        $section11A->subjects()->attach([2, 3, 4, 5, 7, 8]); // Physics, Chemistry, Biology, Combined Math, English, Sinhala

        // Grade 11B subjects (Arts stream)
        $section11B = \App\Models\Section::where('name', 'Grade 11B')->first();
        $section11B->subjects()->attach([7, 8, 9, 10, 15]); // English, Sinhala, History, Geography, Art

        // Grade 12A subjects
        $section12A = \App\Models\Section::where('name', 'Grade 12A')->first();
        $section12A->subjects()->attach([2, 3, 5, 7, 8]); // Physics, Chemistry, Combined Math, English, Sinhala

        // Grade 13A subjects
        $section13A = \App\Models\Section::where('name', 'Grade 13A')->first();
        $section13A->subjects()->attach([2, 3, 5, 7]); // Physics, Chemistry, Combined Math, English
    }
}
