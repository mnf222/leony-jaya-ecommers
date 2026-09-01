<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('products')
            ->orderBy('name')
            ->get();

        return response()->json([
            'data' => $categories,
        ]);
    }

    public function show(Category $category)
    {
        $category->load(['products' => function ($query) {
            $query->where('is_dropped', true)
                ->orWhere('release_date', '<=', now())
                ->with('variants')
                ->latest('release_date');
        }]);

        return response()->json([
            'data' => $category,
        ]);
    }
}
