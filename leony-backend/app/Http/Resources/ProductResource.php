<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Product */
class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $images = $this->relationLoaded('images') ? $this->images : collect();
        $primary = $images->firstWhere('is_primary', true) ?? $images->first();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => $this->price,
            'stock' => $this->stock,
            'size_guide' => $this->size_guide,
            'article_color' => $this->article_color,
            'is_active' => $this->is_active,
            'primary_image' => $primary?->image_url,
            'images' => $images->map(fn ($i) => [
                'id' => $i->id,
                'image_url' => $i->image_url,
                'is_primary' => $i->is_primary,
            ])->values(),
            'created_at' => $this->created_at,
        ];
    }
}
