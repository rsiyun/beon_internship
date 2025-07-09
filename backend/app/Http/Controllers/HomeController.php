<?php

namespace App\Http\Controllers;

use App\Models\Home;
use App\Models\HouseOcupantHistory;
use App\Models\Ocupant;
use Carbon\Carbon;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request){
        $query = Home::query();
        if($request->has('search') && $request->get('search') != null){
            $searchTerm = $request->get('search');
            $query->where('house_number', 'like', '%' . $searchTerm . '%');
        }
        $homes = $query->paginate(10);
        return response()->json([
            "message" => "Homes retrieved successfully",
            "status_code" => 200,
            "data" => $homes
        ], 200);
    }
    public function getAll(){
        // $query = Home::query();
        $homes = Home::get();
        return response()->json([
            "message" => "Homes retrieved successfully",
            "status_code" => 200,
            "data" => $homes
        ], 200);
    }
    public function show($id){
        $home = Home::with(['currentOcupants.ocupant', 'houseOcupantHistories.ocupant'])->find($id);
        if (!$home) {
            return response()->json([
                "message" => "Home not found",
                "status_code" => 404,
            ], 404);
        }
        // $home->load(['currentOcupants.ocupant', 'houseOcupantHistories.ocupant']);
        return response()->json([
            "message" => "Home retrieved successfully",
            "status_code" => 200,
            "data" => $home
        ], 200);
    }
    public function store(Request $request){
        $request->validate([
            'house_number' => 'required|string|max:255|unique:homes',
            'status' => 'required|in:occupied,unoccupied',
        ]);

        $home = Home::create([
            'house_number' => $request->house_number,
            'status' => $request->status,
        ]);
        return response()->json([
            "message" => "Home created successfully",
            "status_code" => 201,
            "data" => $home
        ], 201);
    }

    public function update(Request $request, $id){
        $home = Home::find($id);
        if (!$home) {
            return response()->json([
                "message" => "Home not found",
                "status_code" => 404,
            ], 404);
        }
        $request->validate([
            'house_number' => 'required|string|max:255|unique:homes,house_number,' . $home->id,
            'status' => 'required|in:occupied,unoccupied',
        ]);

        $home->update([
            'house_number' => $request->house_number,
            'status' => $request->status,
        ]);
        return response()->json([
            "message" => "Home updated successfully",
            "status_code" => 200,
            "data" => $home
        ], 200);
    }

    public function addResidentToHouse(Request $request, $id){
        $home = Home::find($id);
        if (!$home) {
            return response()->json([
                "message" => "Home not found",
                "status_code" => 404,
            ], 404);
        }
        $request->validate([
            'ocupant_id' => 'required|exists:ocupants,id',
            'start_date' => 'required|date',
        ]);
        $resident = Ocupant::findOrFail($request->ocupant_id);
        $start_date = Carbon::parse($request->start_date);
        $existingHistory = HouseOcupantHistory::where('ocupant_id', $resident->ocupant_id)
            ->where('home_id', $home->id)
            ->where('is_current_resident', true)
            ->whereDate('start_date', '<=', $start_date)
            ->first();
        if($existingHistory){
            return response()->json([
                "message" => "This ocupant is already registered in this house.",
                "status_code" => 400,
            ], 400);
        }
        $history = HouseOcupantHistory::create([
            'ocupant_id' => $resident->id,
            'home_id' => $home->id,
            'start_date' => $start_date,
            'end_date' => null,
            'is_current_resident' => true,
        ]);
        if ($home->status !== 'Occupied') {
            $home->update(['status' => 'Occupied']);
        }
        return response()->json([
            "message" => "Resident added to house successfully",
            "status_code" => 201,
            "data" => $history
        ], 201);
    }

    public function removeResidentFromHouse(Request $request, $id){
        $home = Home::find($id);
        if (!$home) {
            return response()->json([
                "message" => "Home not found",
                "status_code" => 404,
            ], 404);
        }
        $request->validate([
            'ocupant_id' => 'required|exists:ocupants,id',
            'end_date' => 'required|date',
        ]);
        $resident = Ocupant::findOrFail($request->ocupant_id);
        $end_date = Carbon::parse($request->end_date);

        $existingHistory = HouseOcupantHistory::where('ocupant_id', $resident->id)
            ->where('home_id', $home->id)
            ->where('is_current_resident', true)
            ->first();

        if(!$existingHistory){
            return response()->json([
                "message" => "This ocupant is not registered in this house.",
                "status_code" => 400,
            ], 400);
        }
        $existingHistory->update([
            'end_date' => $end_date,
            'is_current_resident' => false,
        ]);

        $remainingResidents = HouseOcupantHistory::where('home_id', $home->id)
            ->where('is_current_resident', true)
            ->count();
        if ($remainingResidents === 0 && $home->status !== 'Unoccupied') {
            $home->update(['status' => 'Unoccupied']);
        }

        return response()->json([
            "message" => "Resident removed from house successfully",
            "status_code" => 200,
            "data" => $existingHistory
        ], 200);
    }
}
