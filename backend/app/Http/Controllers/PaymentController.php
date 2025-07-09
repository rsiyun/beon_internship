<?php

namespace App\Http\Controllers;

use App\Models\DuesType;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request){
        $query = Payment::query();
        $query->with(['home', 'ocupant', 'duesType']);
        if($request->has('search') && $request->get('search') != null){
            $searchTerm = $request->get('search');
            $query->whereHas('home', function ($q) use ($searchTerm) {
                $q->where('house_number', 'like', '%' . $searchTerm . '%');
            })->orWhereHas('ocupant', function ($q) use ($searchTerm) {
                $q->where('name', 'like', '%' . $searchTerm . '%')
                  ->orWhere('phone', 'like', '%' . $searchTerm . '%');
            });
        }
        if($request->has('dues_type_id') && $request->get('dues_type_id') != null){
            $duesTypeId = $request->get('dues_type_id');
            $query->where('dues_type_id', $duesTypeId);
        }
        if($request->has('status') && $request->get('status') != null){
            $status = $request->get('status');
            $query->where('payment_status', $status);
        }
        if($request->has('month') && $request->get('month') != null){
            $month = $request->get('month');
            $query->whereMonth('payment_date', $month);
        }
        if($request->has('year') && $request->get('year') != null){
            $year = $request->get('year');
            $query->whereYear('payment_date', $year);
        }
        $payments = $query->paginate(15);
        return response()->json([
            "message" => "Payments retrieved successfully",
            "status_code" => 200,
            "data" => $payments
        ], 200);
    }
    public function show($id){
        $payment = Payment::with(['home', 'ocupant', 'duesType'])->find($id);
        if (!$payment) {
            return response()->json([
                "message" => "Payment not found",
                "status_code" => 404,
            ], 404);
        }
        return response()->json([
            "message" => "Payment retrieved successfully",
            "status_code" => 200,
            "data" => $payment
        ], 200);
    }
    public function store(Request $request){
        $request->validate([
            'home_id' => 'required|exists:homes,id',
            'ocupant_id' => 'required|exists:ocupants,id',
            'dues_type_id' => 'required|exists:dues_types,id',
            'payment_date' => 'required|date',
            'number_of_months' => 'nullable|integer|min:1',
            "payment_status" => 'required|in:paid,unpaid',
            "notes" => 'nullable|string',
        ]);
        $duesType = DuesType::where("id", $request->dues_type_id)->first();
        if (!$duesType) {
            return response()->json([
                "message" => "Dues type not found",
                "status_code" => 404,
            ], 404);
        }
        $amount = $duesType->default_amount_per_month * ($request->number_of_months ?? 1);
        $payment = Payment::create([
            "home_id" => $request->home_id,
            "ocupant_id" => $request->ocupant_id,
            "dues_type_id" => $request->dues_type_id,
            "amount" => $amount,
            "payment_date" => Carbon::parse($request->payment_date),
            "number_of_months" => $request->number_of_months,
            "payment_status" => $request->payment_status,
            "notes" => $request->notes,
        ]);
        return response()->json([
            "message" => "Payment created successfully",
            "status_code" => 201,
            "data" => $payment
        ], 201);

    }
    public function update(Request $request, $id){
        $payment = Payment::find($id);
        if (!$payment) {
            return response()->json([
                "message" => "Payment not found",
                "status_code" => 404,
            ], 404);
        }
        $request->validate([
            'home_id' => 'required|exists:homes,id',
            'ocupant_id' => 'required|exists:ocupants,id',
            'dues_type_id' => 'required|exists:dues_types,id',
            'payment_date' => 'required|date',
            'number_of_months' => 'nullable|integer|min:1',
            "payment_status" => 'required|in:paid,unpaid',
            "notes" => 'nullable|string',
        ]);
        $duesType = DuesType::where("id", $request->dues_type_id)->first();
        $amount = $duesType->default_amount_per_month * ($request->number_of_months ?? 1);
        $payment->update([
            "home_id" => $request->home_id,
            "ocupant_id" => $request->ocupant_id,
            "dues_type_id" => $request->dues_type_id,
            "amount" => $amount,
            'payment_date' => Carbon::parse($request->payment_date),
            "number_of_months" => $request->number_of_months,
            "payment_status" => $request->payment_status,
            "notes" => $request->notes,
        ]);
        return response()->json([
            "message" => "Payment updated successfully",
            "status_code" => 200,
            "data" => $payment
        ], 200);
    }
}
