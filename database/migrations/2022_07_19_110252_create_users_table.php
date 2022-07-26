<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user', function (Blueprint $table) {
            $table->id();
            $table->string("staff_code")->nullable();
            $table->string('first_name');
            $table->string('last_name');
            $table->string("full_name")->nullable();
            $table->timestamp('date_of_birth')->nullable();
            $table->string('gender')->nullable();
            $table->timestamp('joined_date')->nullable();
            $table->string("username")->unique();
            $table->string('password');
            $table->string('status')->nullable();
            $table->enum('type', array('Staff', 'Admin'));
            $table->foreignId('location_id')->constrained('location')->onDelete('cascade');
            $table->timestamp("password_change_at")->nullable();
            $table->timestamps();
            $table->rememberToken();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user', function (Blueprint $table) {
            $table->dropForeign(['location_id']);
        });
        Schema::dropIfExists('user');
    }
};
