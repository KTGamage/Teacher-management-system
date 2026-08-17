<?php

namespace Database\Seeders;

use App\Models\Student;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        // Students for Grade 10A
        Student::create([
            'user_id' => 6, // Kasun Rajapaksha
            'registration_number' => 'STU001',
            'full_name' => 'Kasun Rajapaksha',
            'section_id' => 1,
            'class_room_id' => 1,
            'date_of_birth' => '2008-05-15',
            'contact_number' => '0775123456',
            'address' => '12, Park Road, Karandeniya',
            'guardian_name' => 'Mr. Rajapaksha',
            'guardian_contact' => '0775123456',
        ]);

        Student::create([
            'user_id' => 7, // Dilini Wijesinghe
            'registration_number' => 'STU002',
            'full_name' => 'Dilini Wijesinghe',
            'section_id' => 1,
            'class_room_id' => 1,
            'date_of_birth' => '2008-08-22',
            'contact_number' => '0776123456',
            'address' => '45, Station Road, Karandeniya',
            'guardian_name' => 'Mrs. Wijesinghe',
            'guardian_contact' => '0776123456',
        ]);

        Student::create([
            'user_id' => 8, // Tharindu Gunasekara
            'registration_number' => 'STU003',
            'full_name' => 'Tharindu Gunasekara',
            'section_id' => 1,
            'class_room_id' => 1,
            'date_of_birth' => '2008-03-10',
            'contact_number' => '0777123456',
            'address' => '78, Beach Road, Karandeniya',
            'guardian_name' => 'Mr. Gunasekara',
            'guardian_contact' => '0777123456',
        ]);

        // Additional students for Grade 10A (no user accounts)
        Student::create([
            'user_id' => 6, // Reuse user for demo
            'registration_number' => 'STU004',
            'full_name' => 'Amila Perera',
            'section_id' => 1,
            'class_room_id' => 1,
            'date_of_birth' => '2008-06-18',
            'contact_number' => '0778123456',
            'address' => '23, Hill Street, Karandeniya',
            'guardian_name' => 'Mrs. Perera',
            'guardian_contact' => '0778123456',
        ]);

        Student::create([
            'user_id' => 7, // Reuse user for demo
            'registration_number' => 'STU005',
            'full_name' => 'Sanduni Fernando',
            'section_id' => 1,
            'class_room_id' => 1,
            'date_of_birth' => '2008-09-25',
            'contact_number' => '0779123456',
            'address' => '67, Lake View, Karandeniya',
            'guardian_name' => 'Mr. Fernando',
            'guardian_contact' => '0779123456',
        ]);

        // Students for Grade 10B
        Student::create([
            'user_id' => 8, // Reuse user for demo
            'registration_number' => 'STU006',
            'full_name' => 'Nimal Silva',
            'section_id' => 2,
            'class_room_id' => 2,
            'date_of_birth' => '2008-04-12',
            'contact_number' => '0771223456',
            'address' => '89, Market Street, Karandeniya',
            'guardian_name' => 'Mrs. Silva',
            'guardian_contact' => '0771223456',
        ]);

        Student::create([
            'user_id' => 6, // Reuse user for demo
            'registration_number' => 'STU007',
            'full_name' => 'Ishara Jayawardena',
            'section_id' => 2,
            'class_room_id' => 2,
            'date_of_birth' => '2008-07-30',
            'contact_number' => '0772223456',
            'address' => '34, Church Road, Karandeniya',
            'guardian_name' => 'Mr. Jayawardena',
            'guardian_contact' => '0772223456',
        ]);

        // Students for Grade 11A
        Student::create([
            'user_id' => 7, // Reuse user for demo
            'registration_number' => 'STU008',
            'full_name' => 'Saman Gamage',
            'section_id' => 3,
            'class_room_id' => 3,
            'date_of_birth' => '2007-02-14',
            'contact_number' => '0773223456',
            'address' => '56, School Lane, Karandeniya',
            'guardian_name' => 'Mrs. Gamage',
            'guardian_contact' => '0773223456',
        ]);

        Student::create([
            'user_id' => 8, // Reuse user for demo
            'registration_number' => 'STU009',
            'full_name' => 'Nadeesha Bandara',
            'section_id' => 3,
            'class_room_id' => 3,
            'date_of_birth' => '2007-11-08',
            'contact_number' => '0774223456',
            'address' => '90, Main Road, Karandeniya',
            'guardian_name' => 'Mr. Bandara',
            'guardian_contact' => '0774223456',
        ]);

        // Students for Grade 11B
        Student::create([
            'user_id' => 6, // Reuse user for demo
            'registration_number' => 'STU010',
            'full_name' => 'Chamali Mendis',
            'section_id' => 4,
            'class_room_id' => 4,
            'date_of_birth' => '2007-05-20',
            'contact_number' => '0775223456',
            'address' => '12, Temple Road, Karandeniya',
            'guardian_name' => 'Mrs. Mendis',
            'guardian_contact' => '0775223456',
        ]);
    }
}
