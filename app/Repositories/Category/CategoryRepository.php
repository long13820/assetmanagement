<?php

namespace App\Repositories\Category;

use App\Http\Resources\CategoryResource;
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
        )->get();

        return CategoryResource::collection($data)->response()->getData();
    }

    public function store($request)
    {
        $request['category_prefix'] = "";
        $category = $this->query->create($request);
        return $this->query->find($category["id"]);
    }
}
