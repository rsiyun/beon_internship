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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ocupant_id');
            $table->foreign('ocupant_id')->references('id')->on('ocupants')->onDelete('cascade');
            $table->unsignedBigInteger('home_id');
            $table->foreign('home_id')->references('id')->on('homes')->onDelete('cascade');
            $table->unsignedBigInteger('dues_type_id');
            $table->foreign('dues_type_id')->references('id')->on('dues_types')->onDelete('cascade');
            $table->date('payment_date');
            $table->smallInteger('number_of_months')->default(1);
            $table->decimal('amount', 10, 2);
            $table->enum('payment_status', ['paid', 'unpaid'])->default('unpaid');
            $table->longText('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
