<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_name' => 'required|string|max:100',
            'user_email' => 'required|email|max:100',
            'user_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.variant_id' => 'required|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        return DB::transaction(function () use ($request) {
            $items = $request->items;
            $subtotal = 0;
            $orderItems = [];

            foreach ($items as $item) {
                $variant = ProductVariant::lockForUpdate()->findOrFail($item['variant_id']);

                if ($variant->stock < $item['quantity']) {
                    return response()->json([
                        'message' => 'Insufficient stock',
                        'errors' => [
                            'items.*.quantity' => "Only {$variant->stock} items available for {$variant->product->title} - {$variant->size}",
                        ],
                    ], 422);
                }

                $price = $variant->price ?? $variant->product->base_price;
                $subtotal += $price * $item['quantity'];

                $variant->decrement('stock', $item['quantity']);

                $orderItems[] = [
                    'variant_id' => $variant->id,
                    'quantity' => $item['quantity'],
                    'price' => $price,
                ];
            }

            $shippingCost = $subtotal >= 20000 ? 0 : 15000;
            $totalAmount = $subtotal + $shippingCost;

            $orderNumber = 'LJ-'.date('Ymd').'-'.strtoupper(substr(uniqid(), -6));

            $order = Order::create([
                'order_number' => $orderNumber,
                'user_name' => $request->user_name,
                'user_email' => $request->user_email,
                'user_phone' => $request->user_phone,
                'shipping_address' => $request->shipping_address,
                'total_amount' => $totalAmount,
                'shipping_cost' => $shippingCost,
                'status' => 'pending',
            ]);

            foreach ($orderItems as $orderItem) {
                $order->items()->create($orderItem);
            }

            $order->load('items.variant.product');

            return response()->json([
                'data' => $order,
                'message' => 'Order created successfully',
            ], 201);
        });
    }

    public function show(string $orderNumber)
    {
        $order = Order::with('items.variant.product')
            ->where('order_number', $orderNumber)
            ->firstOrFail();

        return response()->json([
            'data' => $order,
        ]);
    }

    public function index(Request $request)
    {
        $query = Order::with('items.variant.product')->latest();

        if ($request->has('email')) {
            $query->where('user_email', $request->email);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->paginate(min($request->get('per_page', 10), 50));

        return response()->json($orders);
    }
}
