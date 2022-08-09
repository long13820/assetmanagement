<?php

namespace App\Services\Asset;

use App\Http\Traits\ApiResponse;
use App\Repositories\Asset\AssetRepository;
use Illuminate\Http\JsonResponse;

class AssetService
{
    use apiResponse;

    protected AssetRepository $assetRepository;

    public function __construct(AssetRepository $assetRepository)
    {
        $this->assetRepository = $assetRepository;
    }

    public function getAllAsset($request)
    {
        $result = $this->assetRepository->getAllAsset($request);
        return $this->apiResponse($result, 'success', 'Get All Asset Success');
    }

    public function store($request)
    {
        return $this->assetRepository->store($request);
    }

    public function showDetail($id)
    {
        $result = $this->assetRepository->showDetail($id);
        return $this->apiResponse($result, 'success', 'Show asset details Success');
    }

    public function updateAsset($request, $id): JsonResponse
    {
        $result = $this->assetRepository->handleUpdateAsset($request, $id);

        if ($result) {
            return $this->apiResponse($result, 'success', 'Update Asset Successfully');
        } else {
            return $this->apiResponse([], 'fail', 'Update Asset Unsuccessfully');
        }
    }

    public function delete($id): JsonResponse
    {
        return $this->assetRepository->delete($id);
    }

    public function checkAsset($id): JsonResponse
    {
        return $this->assetRepository->checkAsset($id);
    }
}
