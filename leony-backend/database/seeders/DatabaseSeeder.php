<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@leonyjaya.test'],
            ['name' => 'Admin Leony Jaya', 'password' => 'ChangeMe123!', 'role' => 'admin', 'phone' => '081234567890']
        );

        $sizeGuide = "28 - Waist 71cm | Length 100cm\n30 - Waist 76cm | Length 101cm\n32 - Waist 81cm | Length 102cm\n34 - Waist 86cm | Length 103cm";

        $items = [
            ['Raw Indigo Selvedge 14oz', 449000, 25, '#3B5BDB', 'Deep indigo raw selvedge denim, straight fit.'],
            ['Washed Black Wide Cut', 399000, 30, '#9CA3AF', 'Washed black denim with a wide streetwear silhouette.'],
            ['Crimson Rinse Baggy', 429000, 18, '#DC2626', 'Rinsed red-cast baggy denim with heavy drape.'],
            ['Olive Dye Carpenter', 419000, 20, '#84CC16', 'Olive overdyed carpenter-style denim.'],
        ];

        foreach ($items as [$name, $price, $stock, $color, $desc]) {
            $product = Product::updateOrCreate(
                ['slug' => Str::slug($name)],
                [
                    'name' => $name, 'description' => $desc, 'price' => $price,
                    'stock' => $stock, 'size_guide' => $sizeGuide,
                    'article_color' => $color, 'is_active' => true,
                ]
            );

            if ($product->images()->doesntExist()) {
                $product->images()->create([
                    'image_url' => 'https://placehold.co/800x1000/0D0D0D/'.ltrim($color, '#').'.png?text='.urlencode(strtoupper($name)),
                    'is_primary' => true,
                ]);
            }
        }
    }
}
