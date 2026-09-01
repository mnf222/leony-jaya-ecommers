<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'variants'])
            ->where(function ($q) {
                $q->where('is_dropped', true)
                    ->orWhere('release_date', '<=', now());
            });

        if ($request->has('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $request->category));
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                    ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        if ($request->has('sort')) {
            match ($request->sort) {
                'price_asc' => $query->orderBy('base_price', 'asc'),
                'price_desc' => $query->orderBy('base_price', 'desc'),
                'newest' => $query->orderBy('release_date', 'desc'),
                'oldest' => $query->orderBy('release_date', 'asc'),
                default => $query->orderBy('release_date', 'desc'),
            };
        } else {
            $query->orderBy('release_date', 'desc');
        }

        $perPage = min($request->get('per_page', 12), 48);
        $products = $query->paginate($perPage);

        return response()->json($products);
    }

    public function show(Product $product)
    {
        $product->load(['category', 'variants']);

        $product->variants->each(function ($variant) {
            $variant->effective_price = $variant->price ?? $variant->product->base_price;
        });

        return response()->json([
            'data' => $product,
        ]);
    }

    public function upcoming()
    {
        $products = Product::with(['category', 'variants'])
            ->where('is_dropped', false)
            ->where('release_date', '>', now())
            ->orderBy('release_date', 'asc')
            ->get();

        return response()->json([
            'data' => $products,
        ]);
    }

    public function dropped()
    {
        $products = Product::with(['category', 'variants'])
            ->where('is_dropped', true)
            ->orWhere('release_date', '<=', now())
            ->orderBy('release_date', 'desc')
            ->get();

        return response()->json([
            'data' => $products,
        ]);
    }
}
