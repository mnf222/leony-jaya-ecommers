<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'user_name',
        'user_email',
        'user_phone',
        'shipping_address',
        'total_amount',
        'shipping_cost',
        'status',
        'payment_token',
        'tracking_number',
        'payment_details',
        'shipping_details',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'payment_details' => 'array',
        'shipping_details' => 'array',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getRouteKeyName(): string
    {
        return 'order_number';
    }
}
