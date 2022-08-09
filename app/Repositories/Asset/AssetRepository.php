<?php

namespace App\Repositories\Asset;

use App\Http\Resources\Asset\AssetResource;
use App\Http\Resources\Asset\DetailAssetResource;
use App\Models\Asset;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

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
        $asset = Asset::query()->create($request);
        return Asset::query()->find($asset["id"]);
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

        return DetailAssetResource::collection($data);
    }

    public function handleUpdateAsset($request, $id)
    {
        $asset = Asset::query()->where('id', '=', $id)->first();
        $asset->update($request->all());
        return $asset;
    }

    public function delete($id): JsonResponse
    {
        $asset = Asset::query()->find($id);

        if ($asset) {
            if ($asset->assignment()->exists()) {
                return response()->json(
                    [
                        "success" => false,
                        "message" => "There are valid assignments belonging to this asset.Please change state"
                    ],
                    400
                );
            }
            $asset->delete();
            return response()->json(
                [
                    "success" => true,
                    "message" => "User is deleted"
                ],
                200
            );
        }
    }

    public function checkAsset($id): JsonResponse
    {
        $asset = Asset::query()->find($id);

        if ($asset) {
            if ($asset->assignment()->exists()) {
                return response()->json(
                    [
                        "success" => false,
                        "message" => "There are valid assignments belonging to this asset. Please change state"
                    ],
                    400
                );
            }
            return response()->json(
                [
                    "success" => true,
                    "message" => "User can deleted"
                ],
                200
            );
        } else {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Asset not exists",
                ],
                400
            );
        }
    }
}
