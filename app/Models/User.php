<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as AuthenticateTable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

class User extends AuthenticateTable
{
    use HasFactory;
    use Notifiable;
    use HasApiTokens;

    protected $table = 'user';
    protected string $staff_code_prefix = 'SD';

    public function userLocation(): BelongsTo
    {
        return $this->belongsTo(Location::class, "location_id");
    }
    public function assignment(): HasMany
    {
        return $this->hasMany(Assignment::class, 'user_id');
    }
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        "staff_code",
        'first_name',
        'last_name',
        'gender',
        'date_of_birth',
        'joined_date',
        'status',
        'username',
        'password',
        'type',
        'location_id',
        'full_name'
    ];

    protected $dates = ["password_change_at", "date_of_birth", "joined_date", "updated_at"];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];


    public function staffCode(): Attribute
    {
        $count = User::query()->count();

        $staffCode =
            $this->staff_code_prefix . str_pad($count + 1, 4, 0, STR_PAD_LEFT);

        return Attribute::make(
            set: fn() => $staffCode,
        );
    }

    public function fullName(): Attribute
    {
        $fullName = $this->first_name . ' ' . $this->last_name;

        return Attribute::make(
            get: fn() => $fullName,
            set: fn() => $fullName,
        );
    }

    public function getUserName()
    {
        $firstName = strtolower($this->first_name);
        $firstName = preg_replace('/\s+/', '', $firstName);
        $getFirstLetter = explode(" ", $this->last_name);
        $tmp_firstLetter = "";
        foreach ($getFirstLetter as $w) {
            $tmp_firstLetter .= $w[0];
        }
        $tmp_username = $firstName . strtolower($tmp_firstLetter);
        $count = User::query()
            ->where("username", "LIKE", "{$tmp_username}%")
            ->count();
        return $tmp_username . ($count > 0 ? $count : "");
    }

    public function setUsernameAttribute()
    {
        $username = $this->getUserName();
        $this->attributes["username"] = $username;
    }

    public function setPasswordAttribute($password)
    {
        $username = $this->getUserName();
        $dob = Str::of(Carbon::parse($this->attributes["date_of_birth"])->format("d-m-Y"))->explode("-")->join("");
        $password = $username . "@" . $dob;
        $this->attributes["password"] = bcrypt($password);
    }

    public function scopeFilter($query, $request)
    {
        return $query
            ->when($request->has("filter.type"), function ($query) use ($request) {
                $list = explode(",", $request->query("filter")["type"]);
                $query->whereIn("type", $list);
            });
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
                    ->where("full_name", "ILIKE", "%{$search}%")
                    ->orWhere("staff_code", "ILIKE", "%{$search}%")
                    ->orWhere("username", "ILIKE", "%{$search}");
            });
    }
}
