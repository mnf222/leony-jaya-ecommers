<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_products_endpoint_returns_successful_json(): void
    {
        $response = $this->getJson('/api/products');

        $response->assertOk()->assertJsonStructure(['data']);
    }

    public function test_auth_and_order_endpoints_use_the_api_routes(): void
    {
        $this->postJson('/api/login')->assertUnprocessable();
        $this->getJson('/api/me')->assertUnauthorized();
        $this->getJson('/api/orders')->assertUnauthorized();
    }
}
