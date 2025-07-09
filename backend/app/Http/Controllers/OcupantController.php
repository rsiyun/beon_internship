<?php

namespace App\Http\Controllers;

use App\Models\Ocupant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpKernel\Event\ResponseEvent;

class OcupantController extends Controller
{

    public function index(Request $request){
        $query = Ocupant::query();
        if($request->has('search') && $request->get('search') != null){
            $query->search($request->get('search'));
        }
        $ocupants = $query->paginate(15);
        return response()->json([
            "message" => "Ocupants retrieved successfully",
            "status_code" => 200,
            "data" => $ocupants
        ], 200);
    }

    public function getAll(Request $request){
        $query = Ocupant::query();
        if($request->has('search') && $request->get('search') != null){
            $query->search($request->get('search'));
        }
        $ocupants = $query->get();
        return response()->json([
            "message" => "Ocupants retrieved successfully",
            "status_code" => 200,
            "data" => $ocupants
        ], 200);
    }

    public function show($id){
        $ocupant = Ocupant::find($id);
        if(!$ocupant){
            return response()->json([
                "message" => "Ocupant not found",
                "status_code" => 404,
            ], 404);
        }
        return response()->json([
            "message" => "Ocupant retrieved successfully",
            "status_code" => 200,
            "data" => $ocupant
        ], 200);
    }

    public function getOcupantByHomeId($home_id){
        $ocupants = Ocupant::with(['currentHouseOcupantHistory.home'])
            ->whereHas('currentHouseOcupantHistory', function ($query) use ($home_id) {
                $query->where('home_id', $home_id);
            })->get();

        return response()->json([
            "message" => "Ocupants retrieved successfully",
            "status_code" => 200,
            "data" => $ocupants
        ], 200);
    }

    public function store(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'identity_card' => 'required|image|mimes:jpeg,png,jpg',
            'phone' => 'required|string|max:15',
            'resident_status' => 'required|in:contract,permanent',
            'is_married' => 'required|boolean',
        ]);
        $imageFile = $request->file('identity_card');
        $filename = time() . '_' . uniqid() . '.' . $imageFile->getClientOriginalExtension();
        Storage::disk('public')->putFileAs('identity-card', $imageFile, $filename);
        $ocupant = Ocupant::create([
            'name' => $request->name,
            'identity_card' => $filename,
            'phone' => $request->phone,
            'resident_status' => $request->resident_status,
            'is_married' => $request->is_married,
        ]);
        return response()->json([
            "message" => "Ocupant created successfully",
            "status_code" => 201,
            "data" => $ocupant
        ], 201);
    }

    public function update(Request $request, $id){
        $ocupant = Ocupant::find($id);
        if(!$ocupant){
            return response()->json([
                "message" => "Ocupant not found",
                "status_code" => 404,
            ], 404);
        }
        $request->validate([
            'name' => 'required|string|max:255',
            'identity_card' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'phone' => 'required|string|max:15',
            'resident_status' => 'required|in:contract,permanent',
            'is_married' => 'required|boolean',
        ]);
        $data = [
            'name' => $request->name,
            'phone' => $request->phone,
            'resident_status' => $request->resident_status,
            'is_married' => $request->is_married,
        ];
        if ($request->hasFile('identity_card')) {
            $imageFile = $request->file('identity_card');
            $filename = time() . '_' . uniqid() . '.' . $imageFile->getClientOriginalExtension();
            Storage::disk('public')->putFileAs('identity-card', $imageFile, $filename);
            if ($ocupant->identity_card) {
                Storage::disk('public')->delete('identity-card/' . $ocupant->identity_card);
            }
            $data['identity_card'] = $filename;
        }
        $ocupant->update($data);
        return response()->json([
            "message" => "Ocupant updated successfully",
            "status_code" => 200,
            "data" => $ocupant
        ], 200);

    }
}
