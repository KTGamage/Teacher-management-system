<?php

namespace Database\Seeders;

use App\Models\ClassRoom;
use Illuminate\Database\Seeder;

class ClassRoomSeeder extends Seeder
{
    public function run(): void
    {
        $classrooms = [
            ['section_id' => 1, 'name' => 'Room A101'],
            ['section_id' => 2, 'name' => 'Room A102'],
            ['section_id' => 3, 'name' => 'Room B201'],
            ['section_id' => 4, 'name' => 'Room B202'],
            ['section_id' => 5, 'name' => 'Room C301'],
            ['section_id' => 6, 'name' => 'Room C302'],
        ];

        foreach ($classrooms as $classroom) {
            ClassRoom::create($classroom);
        }
    }
}
