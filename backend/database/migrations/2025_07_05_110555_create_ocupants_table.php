<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ocupants', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->string("identity_card");
            $table->enum("resident_status", ["contract", "permanent"]);
            $table->string("phone");
            $table->boolean("is_married")->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ocupants');
    }
};
