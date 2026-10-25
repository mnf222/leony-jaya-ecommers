<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    /** GET /api/orders (admins see all, users see their own) */
    public function index(Request $request)
    {
        $user = $request->user();

        $orders = Order::query()
            ->with('items.product')
            ->when(! $user->isAdmin(), fn ($q) => $q->where('user_id', $user->id))
            ->latest()
            ->paginate(15);

        return OrderResource::collection($orders);
    }

    /** GET /api/orders/{order} */
    public function show(Request $request, Order $order): OrderResource
    {
        abort_unless($request->user()->isAdmin() || $order->user_id === $request->user()->id, 404);

        return new OrderResource($order->load('items.product'));
    }

    /** POST /api/orders. Prices are always read server-side from the DB. */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'payment_method' => ['required', 'string', 'max:50'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:20'],
            'items.*.size' => ['required', 'string', 'max:10'],
        ]);

        $order = DB::transaction(function () use ($data, $request) {
            $total = 0;
            $lines = [];

            foreach (array_values($data['items']) as $i => $item) {
                $product = Product::whereKey($item['product_id'])->lockForUpdate()->firstOrFail();

                if (! $product->is_active) {
                    throw ValidationException::withMessages(["items.$i.product_id" => 'Product is not available.']);
                }
                if ($product->stock < $item['quantity']) {
                    throw ValidationException::withMessages(["items.$i.quantity" => "Insufficient stock for {$product->name}."]);
                }

                $product->decrement('stock', $item['quantity']);
                $total += $product->price * $item['quantity'];
                $lines[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'size' => $item['size'],
                ];
            }

            $order = Order::create([
                'user_id' => $request->user()->id,
                'total_price' => $total,
                'status' => 'pending',
                'payment_method' => $data['payment_method'],
            ]);
            $order->items()->createMany($lines);

            return $order;
        });

        return (new OrderResource($order->load('items.product')))
            ->response()->setStatusCode(201);
    }

    /** PATCH /api/admin/orders/{order} */
    public function update(Request $request, Order $order): OrderResource
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(Order::STATUSES)],
            'resi_number' => ['nullable', 'string', 'max:100'],
        ]);

        $order->update($data);

        return new OrderResource($order->load('items.product'));
    }
}
