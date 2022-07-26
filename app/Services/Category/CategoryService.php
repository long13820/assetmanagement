<?php

namespace App\Services\Category;

use App\Http\Traits\ApiResponse;
use App\Repositories\Category\CategoryRepository;
use Illuminate\Http\JsonResponse;

class CategoryService
{
    use apiResponse;

    protected CategoryRepository $categoryRepository;

    public function __construct(CategoryRepository $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    public function getAllCategory(): JsonResponse
    {
        $result = $this->categoryRepository->getAllCategory();

        return $this->apiResponse($result, 'success', 'Get All Category Success');
    }

    public function store($request)
    {
        return $this->categoryRepository->store($request);
    }
}
