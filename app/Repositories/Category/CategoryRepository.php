<?php

namespace App\Repositories\Category;

use App\Http\Resources\Category\CategoryResource;
use App\Models\Category;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class CategoryRepository
{
    protected Builder $query;

    public function __construct()
    {
        $this->query = Category::query();
    }

    public function getAllCategory()
    {
        $data = $this->query->select(
            "categories.id",
            "categories.category_name",
            "categories.category_prefix"
        )->get();

        return CategoryResource::collection($data)->response()->getData();
    }

    public function store($request)
    {
        $category = Category::create($request);

        return $category;
    }
}
