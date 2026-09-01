<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $rawDenim = Category::where('slug', 'raw-denim')->first();
        $distressed = Category::where('slug', 'distressed-jeans')->first();
        $jackets = Category::where('slug', 'denim-jackets')->first();
        $shirts = Category::where('slug', 'denim-shirts')->first();

        $products = [
            [
                'category_id' => $rawDenim->id,
                'title' => '14oz Japanese Selvedge',
                'slug' => '14oz-japanese-selvedge',
                'description' => 'Premium 14oz Japanese selvedge denim from Okayama. Unsanforized, unwashed, and ready to mold to your body. Features red-line selvedge ID, hidden rivets, and a classic five-pocket construction.',
                'wash_details' => 'Raw / Unwashed',
                'denim_weight' => '14oz',
                'base_price' => 289.00,
                'is_dropped' => true,
                'release_date' => Carbon::now()->subDays(30),
                'variants' => [
                    ['sku' => 'LJ-14SEL-28', 'size' => '28', 'stock' => 15, 'price' => null],
                    ['sku' => 'LJ-14SEL-30', 'size' => '30', 'stock' => 20, 'price' => null],
                    ['sku' => 'LJ-14SEL-32', 'size' => '32', 'stock' => 18, 'price' => null],
                    ['sku' => 'LJ-14SEL-34', 'size' => '34', 'stock' => 12, 'price' => null],
                    ['sku' => 'LJ-14SEL-36', 'size' => '36', 'stock' => 8, 'price' => null],
                ],
            ],
            [
                'category_id' => $rawDenim->id,
                'title' => '18oz Heavyweight Selvedge',
                'slug' => '18oz-heavyweight-selvedge',
                'description' => 'For the true denim enthusiast. 18oz heavyweight selvedge that breaks in like armor. Double-needle stitching throughout, copper rivets, and a leather patch that ages beautifully.',
                'wash_details' => 'Raw / Unwashed',
                'denim_weight' => '18oz',
                'base_price' => 349.00,
                'is_dropped' => true,
                'release_date' => Carbon::now()->subDays(15),
                'variants' => [
                    ['sku' => 'LJ-18HW-30', 'size' => '30', 'stock' => 10, 'price' => null],
                    ['sku' => 'LJ-18HW-32', 'size' => '32', 'stock' => 12, 'price' => null],
                    ['sku' => 'LJ-18HW-34', 'size' => '34', 'stock' => 8, 'price' => null],
                    ['sku' => 'LJ-18HW-36', 'size' => '36', 'stock' => 6, 'price' => null],
                ],
            ],
            [
                'category_id' => $distressed->id,
                'title' => 'Vintage Wash Slim Fit',
                'slug' => 'vintage-wash-slim-fit',
                'description' => 'Authentic vintage wash with natural whiskering, honeycombs, and fade patterns. Each pair is individually hand-distressed. 12oz stretch denim for all-day comfort.',
                'wash_details' => 'Vintage Indigo Wash',
                'denim_weight' => '12oz Stretch',
                'base_price' => 249.00,
                'is_dropped' => true,
                'release_date' => Carbon::now()->subDays(45),
                'variants' => [
                    ['sku' => 'LJ-VWS-28', 'size' => '28', 'stock' => 25, 'price' => null],
                    ['sku' => 'LJ-VWS-30', 'size' => '30', 'stock' => 30, 'price' => null],
                    ['sku' => 'LJ-VWS-32', 'size' => '32', 'stock' => 28, 'price' => null],
                    ['sku' => 'LJ-VWS-34', 'size' => '34', 'stock' => 20, 'price' => null],
                    ['sku' => 'LJ-VWS-36', 'size' => '36', 'stock' => 15, 'price' => null],
                ],
            ],
            [
                'category_id' => $distressed->id,
                'title' => 'Acid Wash Oversized',
                'slug' => 'acid-wash-oversized',
                'description' => 'Limited edition acid wash with oversized silhouette. Unique marble-like pattern on 13oz denim. Only 100 pieces produced worldwide. Each pair numbered.',
                'wash_details' => 'Acid Wash',
                'denim_weight' => '13oz',
                'base_price' => 399.00,
                'is_dropped' => true,
                'release_date' => Carbon::now()->subDays(7),
                'variants' => [
                    ['sku' => 'LJ-AWO-30', 'size' => '30', 'stock' => 5, 'price' => null],
                    ['sku' => 'LJ-AWO-32', 'size' => '32', 'stock' => 3, 'price' => null],
                    ['sku' => 'LJ-AWO-34', 'size' => '34', 'stock' => 2, 'price' => null],
                ],
            ],
            [
                'category_id' => $jackets->id,
                'title' => 'Type III Trucker Jacket',
                'slug' => 'type-iii-trucker-jacket',
                'description' => 'Classic Type III trucker jacket in 14oz selvedge denim. Two chest pockets with flap closures, adjustable waist tabs, and signature copper hardware. The ultimate layering piece.',
                'wash_details' => 'Raw / Unwashed',
                'denim_weight' => '14oz',
                'base_price' => 329.00,
                'is_dropped' => true,
                'release_date' => Carbon::now()->subDays(20),
                'variants' => [
                    ['sku' => 'LJ-T3J-S', 'size' => 'S', 'stock' => 15, 'price' => null],
                    ['sku' => 'LJ-T3J-M', 'size' => 'M', 'stock' => 20, 'price' => null],
                    ['sku' => 'LJ-T3J-L', 'size' => 'L', 'stock' => 18, 'price' => null],
                    ['sku' => 'LJ-T3J-XL', 'size' => 'XL', 'stock' => 12, 'price' => null],
                ],
            ],
            [
                'category_id' => $jackets->id,
                'title' => 'Sherpa Lined Type II',
                'slug' => 'sherpa-lined-type-ii',
                'description' => 'Type II jacket with premium sherpa lining for winter warmth. 13oz denim exterior, full sherpa interior including collar. Vintage-inspired fit with modern comfort.',
                'wash_details' => 'Medium Stone Wash',
                'denim_weight' => '13oz',
                'base_price' => 389.00,
                'is_dropped' => true,
                'release_date' => Carbon::now()->subDays(10),
                'variants' => [
                    ['sku' => 'LJ-SL2-M', 'size' => 'M', 'stock' => 10, 'price' => null],
                    ['sku' => 'LJ-SL2-L', 'size' => 'L', 'stock' => 12, 'price' => null],
                    ['sku' => 'LJ-SL2-XL', 'size' => 'XL', 'stock' => 8, 'price' => null],
                ],
            ],
            [
                'category_id' => $rawDenim->id,
                'title' => '21oz "Iron Wall" Selvedge',
                'slug' => '21oz-iron-wall-selvedge',
                'description' => 'Our heaviest offering yet. 21oz "Iron Wall" selvedge from Nihon Menpu mills. Extreme weight for extreme fading potential. Limited to 50 pairs.',
                'wash_details' => 'Raw / Unwashed',
                'denim_weight' => '21oz',
                'base_price' => 449.00,
                'is_dropped' => false,
                'release_date' => Carbon::now()->addDays(14),
                'variants' => [
                    ['sku' => 'LJ-21IW-30', 'size' => '30', 'stock' => 8, 'price' => null],
                    ['sku' => 'LJ-21IW-32', 'size' => '32', 'stock' => 10, 'price' => null],
                    ['sku' => 'LJ-21IW-34', 'size' => '34', 'stock' => 8, 'price' => null],
                    ['sku' => 'LJ-21IW-36', 'size' => '36', 'stock' => 6, 'price' => null],
                ],
            ],
            [
                'category_id' => $shirts->id,
                'title' => 'Chambray Work Shirt',
                'slug' => 'chambray-work-shirt',
                'description' => 'Lightweight 5oz chambray work shirt. Triple-needle stitching, dual chest pockets with pencil slot, and genuine corozo buttons. Perfect for layering or solo wear.',
                'wash_details' => 'Light Rinse',
                'denim_weight' => '5oz Chambray',
                'base_price' => 149.00,
                'is_dropped' => true,
                'release_date' => Carbon::now()->subDays(60),
                'variants' => [
                    ['sku' => 'LJ-CWS-S', 'size' => 'S', 'stock' => 25, 'price' => null],
                    ['sku' => 'LJ-CWS-M', 'size' => 'M', 'stock' => 30, 'price' => null],
                    ['sku' => 'LJ-CWS-L', 'size' => 'L', 'stock' => 28, 'price' => null],
                    ['sku' => 'LJ-CWS-XL', 'size' => 'XL', 'stock' => 20, 'price' => null],
                ],
            ],
        ];

        foreach ($products as $productData) {
            $variants = $productData['variants'];
            unset($productData['variants']);

            $product = Product::create($productData);

            foreach ($variants as $variant) {
                ProductVariant::create([
                    'product_id' => $product->id,
                    ...$variant,
                ]);
            }
        }
    }
}
