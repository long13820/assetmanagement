<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Asset extends Model
{
    use HasFactory;

    protected $table = 'asset';

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function assignment(): HasMany
    {
        return $this->hasMany(Assignment::class);
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        "asset_code",
        'asset_name',
        'specification',
        'installed_date',
        'state',
        'category_id',
    ];

    public function getCategoryPrefix($id)
    {
        return Asset::query()
            ->join('categories', 'categories.id', '=', 'asset.category_id')
            ->where('asset.category_id', '=', $id)
            ->value('categories.category_prefix');
    }

    public function assetCode(): Attribute
    {
        $categoryPrefix = $this->getCategoryPrefix($this->category_id);

        $count = Asset::query()->count();

        $assetCode =
            $categoryPrefix . str_pad($count + 1, 4, 0, STR_PAD_LEFT);

        return Attribute::make(
            get: fn() => $assetCode,
            set: fn() => $assetCode,
        );
    }

    public function scopeFilter($query, $request)
    {
        return $query
            ->when(
                $request->has('filter.state'),
                function ($query) use ($request) {
                    $list = explode(",", $request->query("filter")["state"]);
                    $query->whereIn("state", $list);
                }
            )
            ->when(
                $request->has('filter.category'),
                function ($query) use ($request) {
                    $list = explode(",", $request->query("filter")["category"]);
                    $query->whereIn("category_id", $list);
                }
            );
    }

    public function scopeSort($query, $request)
    {
        return $query
            ->when($request->has("sort"), function ($query) use ($request) {
                $sortBy = '';
                $sortValue = '';

                foreach ($request->query("sort") as $key => $value) {
                    $sortBy = $key;
                    $sortValue = $value;
                }

                $query->orderBy($sortBy, $sortValue);
            });
    }

    public function scopeSearch($query, $request)
    {
        return $query
            ->when($request->has('search'), function ($query) use ($request) {
                $search = $request->query('search');
                $query
                    ->where("asset_code", "ILIKE", "%{$search}%")
                    ->orWhere("asset_name", "ILIKE", "%{$search}%");
            });
    }
}
