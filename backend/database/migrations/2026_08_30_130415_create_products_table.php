<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            $table->string('title', 150);
            $table->string('slug', 150)->unique();
            $table->text('description')->nullable();
            $table->string('wash_details', 255)->nullable()->comment('e.g., Acid Wash, Vintage Indigo, Stone Wash');
            $table->string('denim_weight', 50)->nullable()->comment('e.g., 14oz Heavyweight Denim, 12oz Stretch');
            $table->decimal('base_price', 12, 2);
            $table->boolean('is_dropped')->default(false);
            $table->timestamp('release_date')->nullable();
            $table->timestamps();

            $table->index(['is_dropped', 'release_date']);
            $table->index('slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
