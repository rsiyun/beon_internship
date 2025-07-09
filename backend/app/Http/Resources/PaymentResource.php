<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
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
            'house_number' => $this->whenLoaded('home', function(){
                return $this->home->house_number;
            }, "N/A"),
            'dues_type' => $this->whenLoaded('duesType', function(){
                return $this->duesType->type_name;
            }, "N/A"),
            'payer_name' => $this->whenLoaded('ocupant', function(){
                return $this->ocupant->name;
            }, "N/A"),
            "start_month" => $this->payment_date->format('M'),
            "start_year" => $this->payment_date->format('Y'),
            "payment_date" => $this->payment_date->format('Y-m-d'),
            "amount" => (float) $this->amount,
            'notes' => $this->notes,
            "payment_status" => $this->payment_status,
            "created_at" => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
