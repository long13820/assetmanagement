<?php

namespace App\Repositories\Asset;

use App\Http\Resources\AssetResource;
use App\Models\Asset;

class AssetRepository
{
    protected $query;

    public function __construct()
    {
        $this->query = Asset::query();
    }

    public function getAllAsset($request)
    {
        $per_page = $request->query('per_page') ? $request->query('per_page') : 20;
        $data = $this->query->select(
            "asset.id",
            "asset.asset_code",
            "asset.asset_name",
            "categories.category_name",
            "asset.category_id",
            "asset.installed_date",
            "asset.state"
        )
            ->filter($request)
            ->sort($request)
            ->search($request)
            ->join('categories', 'asset.category_id', '=', 'categories.id')
            ->where("location_id", "=", auth()->user()->location_id)
            ->paginate($per_page);
        return AssetResource::collection($data)->response()->getData();
    }

    public function store($request)
    {
        $request['asset_code'] = "";
        $asset = Asset::create($request);
        return Asset::find($asset["id"]);
    }

    public function showDetail($id)
    {
        $data = $this->query
            ->select(
                "asset.id",
                "asset.asset_code",
                "asset.asset_name",
                "asset.specification",
                "categories.category_name",
                "asset.category_id",
                "asset.installed_date",
                "asset.state",
                "location.name"
            )
            ->where("location_id", "=", auth()->user()->location_id)
            ->where('asset.id', $id)
            ->with('assignment')
            ->join('categories', 'asset.category_id', '=', 'categories.id')
            ->join('location', 'asset.location_id', '=', 'location.id')
            ->get();
        return $data;
    }

    public function handleUpdateAsset($request, $id)
    {
        $asset = Asset::query()->where('id', '=', $id)->first();
        $asset->update($request->all());
        return $asset;
    }
}
