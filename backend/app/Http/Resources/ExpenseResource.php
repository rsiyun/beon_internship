<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "expense_type" => $this->expense_type,
            "amount" => (float) $this->amount,
            "expense_date" => $this->expense_date->format('Y-m-d'),
            "notes" => $this->description,
            "created_at" => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
