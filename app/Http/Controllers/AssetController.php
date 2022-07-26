<?php

namespace App\Http\Controllers;

use App\Http\Requests\Asset\CreateAssetRequest;
use App\Http\Requests\Asset\EditAssetRequest;
use App\Services\Asset\AssetService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssetController extends Controller
{
    protected AssetService $assetService;

    public function __construct(AssetService $assetService)
    {
        $this->assetService = $assetService;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        return $this->assetService->getAllAsset($request);
    }

    public function create()
    {
        //
    }

    public function store(CreateAssetRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = $this->assetService->store($validated);
        return response()->json([
            "success" => true,
            "message" => "Create user successfully",
            "data" => $user
        ]);
    }

    public function show($id): JsonResponse
    {
        return $this->assetService->showDetail($id);
    }

    public function update(EditAssetRequest $request, $id): JsonResponse
    {
        return $this->assetService->updateAsset($request, $id);
    }
}
