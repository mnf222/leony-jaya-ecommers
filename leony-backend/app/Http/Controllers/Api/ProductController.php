<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /** GET /api/products?search=&per_page= */
    public function index(Request $request)
    {
        $products = Product::query()
            ->active()
            ->with('images')
            ->when($request->filled('search'), function ($q) use ($request) {
                $q->where('name', 'ILIKE', '%'.$request->string('search').'%');
            })
            ->latest()
            ->paginate(min((int) $request->integer('per_page', 12), 50));

        return ProductResource::collection($products);
    }

    /** GET /api/products/{slug} */
    public function show(Product $product): ProductResource
    {
        abort_unless($product->is_active, 404);

        return new ProductResource($product->load('images'));
    }

    /** POST /api/admin/products */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->rules());
        $images = $data['images'] ?? [];
        unset($data['images']);

        $data['slug'] = $this->uniqueSlug($data['slug'] ?? $data['name']);

        $product = DB::transaction(function () use ($data, $images) {
            $product = Product::create($data);
            $this->syncImages($product, $images);

            return $product;
        });

        return (new ProductResource($product->load('images')))
            ->response()->setStatusCode(201);
    }

    /** PUT /api/admin/products/{slug} */
    public function update(Request $request, Product $product): ProductResource
    {
        $data = $request->validate($this->rules(updating: true));
        $images = $data['images'] ?? null;
        unset($data['images']);

        if (isset($data['slug'])) {
            $data['slug'] = $this->uniqueSlug($data['slug'], $product->id);
        }

        DB::transaction(function () use ($product, $data, $images) {
            $product->update($data);
            if ($images !== null) {
                $product->images()->delete();
                $this->syncImages($product, $images);
            }
        });

        return new ProductResource($product->fresh('images'));
    }

    /** DELETE /api/admin/products/{slug} */
    public function destroy(Product $product): JsonResponse
    {
        if ($product->orderItems()->exists()) {
            // Keep order history intact: deactivate instead of deleting.
            $product->update(['is_active' => false]);

            return response()->json(['message' => 'Product has orders and was deactivated instead.']);
        }

        $product->delete();

        return response()->json(null, 204);
    }

    private function rules(bool $updating = false): array
    {
        $req = $updating ? 'sometimes' : 'required';

        return [
            'name' => [$req, 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => [$req, 'integer', 'min:0'],
            'stock' => [$req, 'integer', 'min:0'],
            'size_guide' => ['nullable', 'string'],
            'article_color' => [$req, 'string', 'regex:/^#[A-Fa-f0-9]{6}$/'],
            'is_active' => ['sometimes', 'boolean'],
            'images' => ['sometimes', 'array'],
            'images.*.image_url' => ['required', 'url', 'max:2048'],
            'images.*.is_primary' => ['sometimes', 'boolean'],
        ];
    }

    private function syncImages(Product $product, array $images): void
    {
        if (empty($images)) {
            return;
        }

        $hasPrimary = collect($images)->contains(fn ($i) => ! empty($i['is_primary']));

        foreach (array_values($images) as $index => $image) {
            $product->images()->create([
                'image_url' => $image['image_url'],
                'is_primary' => $hasPrimary ? (bool) ($image['is_primary'] ?? false) : $index === 0,
            ]);
        }
    }

    private function uniqueSlug(string $source, ?int $ignoreId = null): string
    {
        $base = Str::slug($source);
        $slug = $base;
        $i = 2;

        while (Product::where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
}
