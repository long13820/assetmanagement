<?php

namespace App\Http\Controllers;

use App\Http\Requests\Category\CreateCategoryRequest;
use Illuminate\Http\JsonResponse;
use App\Services\Category\CategoryService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    protected CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return $this->categoryService->getAllCategory();
    }
    public function create()
    {
        //
    }

    public function store(CreateCategoryRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $category = $this->categoryService->store($validated);
        return response()->json([
            "success" => true,
            "message" => "Create category successfully",
            "data" => $category
        ]);
    }

    public function show($id)
    {
        //
    }

    public function edit($id)
    {
        //
    }

    public function update(Request $request, $id)
    {
       //
    }

    public function destroy($id)
    {
        //
    }
}
