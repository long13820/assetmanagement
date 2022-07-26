<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'categories';

    protected $fillable = [
        'category_name', 'category_prefix'
    ];

    public function getNumOfWords($string)
    {
        $string = preg_replace('/\s+/', ' ', trim($string));
        $words = explode(" ", $string);
        return count($words);
    }

    public function getCategoryPrefix(): string
    {
        $count = $this->getNumOfWords($this->category_name);
        if ($count < 2) {
            $getFirstLetter = substr($this->category_name, 0, 2);
            $tmp_category_prefix = strtoupper($getFirstLetter);
        } else {
            $getFirstLetter = explode(" ", $this->category_name);
            $tmp_firstLetter = "";
            foreach ($getFirstLetter as $w) {
                $tmp_firstLetter .= $w[0];
            }
            $tmp_category_prefix = strtoupper($tmp_firstLetter);
        }


        return $tmp_category_prefix;
    }

    public function setCategoryPrefixAttribute()
    {
        $category_prefix = $this->getCategoryPrefix();
        $this->attributes["category_prefix"] = $category_prefix;
    }

    public function asset(): HasMany
    {
        return $this->hasMany(Asset::class);
    }
}
