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
    public function index(Request $request)
    {
        return $this->assetService->getAllAsset($request);
    }

    public function create()
    {
        //
    }

    public function store(CreateAssetRequest $request)
    {
        $validated = $request->validated();
        $asset = $this->assetService->store($validated);
        return response()->json([
            "success" => true,
            "message" => "Create user successfully",
            "data" => $asset
        ]);
    }

    public function show($id)
    {
        return $this->assetService->showDetail($id);
    }

    public function update(EditAssetRequest $request, $id)
    {
        return $this->assetService->updateAsset($request, $id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id)
    {
        return $this->assetService->delete($id);
    }

    public function checkAsset($id)
    {
        return $this->assetService->checkAsset($id);
    }
}
