<?php

namespace App\Http\Controllers;

use App\Models\DuesType;
use Illuminate\Http\Request;

class DuesTypeController extends Controller
{
    public function index(Request $request){
        $query = DuesType::query();
        if($request->has('search') && $request->get('search') != null){
            $searchTerm = $request->get('search');
            $query->where('type_name', 'like', '%' . $searchTerm . '%')->orWhere('description', 'like', '%' . $searchTerm . '%');
        }
        $jenis = $query->paginate(15);
        return response()->json([
            "message" => "Dues type retrieved successfully",
            "status_code" => 200,
            "data" => $jenis
        ], 200);
    }
    public function getAll(Request $request){
        $query = DuesType::query();
        if($request->has('search') && $request->get('search') != null){
            $searchTerm = $request->get('search');
            $query->where('type_name', 'like', '%' . $searchTerm . '%')->orWhere('description', 'like', '%' . $searchTerm . '%');
        }
        $query->where('is_active', true);
        $jenis = $query->get();
        return response()->json([
            "message" => "Dues type retrieved successfully",
            "status_code" => 200,
            "data" => $jenis
        ], 200);
    }
    public function show($id){
        $duesType = DuesType::where("id", $id)->first();
        if(!$duesType){
            return response()->json([
                "message" => "Dues type not found",
                "status_code" => 404,
            ], 404);
        }
        return response()->json([
            "message" => "Dues type retrieved successfully",
            "status_code" => 200,
            "data" => $duesType
        ], 200);
    }
    public function store(Request $request){
        $request->validate([
            'type_name' => 'required|string|unique:dues_types',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
        ]);

        $duesType = DuesType::create([
            'type_name' => $request->type_name,
            'default_amount_per_month' => $request->amount,
            'description' => $request->description,
        ]);

        return response()->json([
            "message" => "Dues type created successfully",
            "status_code" => 201,
            "data" => $duesType
        ], 201);
    }
    public function update(Request $request, $id){
        $duesType = DuesType::where("id", $id)->first();
        if(!$duesType){
            return response()->json([
                "message" => "Dues type not found",
                "status_code" => 404,
            ], 404);
        }
        $request->validate([
            'type_name' => 'required|string|max:255|unique:dues_types,type_name,' . $duesType->id,
            'amount' => 'required|numeric|min:0',
        ]);

        $duesType->update([
            'type_name' => $request->type_name,
            'default_amount_per_month' => $request->amount,
        ]);

        return response()->json([
            "message" => "Dues type updated successfully",
            "status_code" => 200,
            "data" => $duesType
        ], 200);
    }
}
