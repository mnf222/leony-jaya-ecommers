<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 50)->unique();
            $table->string('user_name', 100);
            $table->string('user_email', 100);
            $table->string('user_phone', 20);
            $table->text('shipping_address');
            $table->decimal('total_amount', 12, 2);
            $table->decimal('shipping_cost', 12, 2)->default(0);
            $table->enum('status', ['pending', 'paid', 'processing', 'shipped', 'cancelled'])->default('pending');
            $table->string('payment_token', 255)->nullable();
            $table->string('tracking_number', 100)->nullable();
            $table->json('payment_details')->nullable();
            $table->json('shipping_details')->nullable();
            $table->timestamps();

            $table->index('order_number');
            $table->index('user_email');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
