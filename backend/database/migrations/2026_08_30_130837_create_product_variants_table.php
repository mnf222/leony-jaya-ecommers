<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('sku', 50)->unique();
            $table->string('size', 10)->comment('e.g., 28, 30, 32, 34, S, M, L, XL');
            $table->string('color', 50)->nullable();
            $table->unsignedInteger('stock')->default(0);
            $table->decimal('price', 12, 2)->nullable()->comment('Override base price if different');
            $table->timestamps();

            $table->index(['product_id', 'size', 'color']);
            $table->index('sku');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
