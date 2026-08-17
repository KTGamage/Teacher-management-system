<?php

namespace Database\Seeders;

use App\Models\Teacher;
use Illuminate\Database\Seeder;

class TeacherSeeder extends Seeder
{
    public function run(): void
    {
        Teacher::create([
            'user_id' => 2, // Nimal Perera
            'teacher_registration_number' => 'T001',
            'full_name' => 'Nimal Perera',
            'contact_number' => '0771234567',
            'address' => '123, Main Street, Karandeniya',
            'qualifications' => ['BSc in Mathematics', 'PGDE'],
            'specialization' => 'Mathematics',
            'joining_date' => '2010-01-15',
            'is_section_head' => true,
        ]);

        Teacher::create([
            'user_id' => 3, // Kamala Silva
            'teacher_registration_number' => 'T002',
            'full_name' => 'Kamala Silva',
            'contact_number' => '0772234567',
            'address' => '456, Temple Road, Karandeniya',
            'qualifications' => ['BA in Sinhala', 'MEd'],
            'specialization' => 'Sinhala',
            'joining_date' => '2012-03-20',
            'is_section_head' => true,
        ]);

        Teacher::create([
            'user_id' => 4, // Sunil Fernando
            'teacher_registration_number' => 'T003',
            'full_name' => 'Sunil Fernando',
            'contact_number' => '0773234567',
            'address' => '789, School Lane, Karandeniya',
            'qualifications' => ['BSc in Computer Science'],
            'specialization' => 'ICT',
            'joining_date' => '2015-07-10',
            'is_section_head' => true,
        ]);

        Teacher::create([
            'user_id' => 5, // Priyanka Jayawardena
            'teacher_registration_number' => 'T004',
            'full_name' => 'Priyanka Jayawardena',
            'contact_number' => '0774234567',
            'address' => '321, Lake View, Karandeniya',
            'qualifications' => ['BA in English', 'Diploma in TESOL'],
            'specialization' => 'English',
            'joining_date' => '2013-09-05',
            'is_section_head' => true,
        ]);
    }
}
