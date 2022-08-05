<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('assignment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('user');
            $table->foreignId('admin_id')->constrained('user');
            $table->foreignId('asset_id')->constrained('asset');
            $table->date('assigned_date');
            $table->enum('state', array('Accepted', 'Waiting for acceptance', 'Declined', 'Waiting for returning', 'Completed'))->default('Waiting for acceptance')->nullable();
            $table->string('note')->nullable();
            $table->string('returned_date')->nullable();
            $table->string('returned_id')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('assignment');
    }
};