<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Raw Denim', 'slug' => 'raw-denim', 'description' => 'Unwashed, untreated selvedge denim that develops unique fades over time.'],
            ['name' => 'Distressed Jeans', 'slug' => 'distressed-jeans', 'description' => 'Pre-worn looks with authentic distressing, whiskering, and honeycombs.'],
            ['name' => 'Denim Jackets', 'slug' => 'denim-jackets', 'description' => 'Classic Type I, II, and III trucker jackets in various weights.'],
            ['name' => 'Denim Shirts', 'slug' => 'denim-shirts', 'description' => 'Western-style and workwear shirts in chambray and heavy denim.'],
            ['name' => 'Accessories', 'slug' => 'accessories', 'description' => 'Belts, caps, and small leather goods to complete your denim look.'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
