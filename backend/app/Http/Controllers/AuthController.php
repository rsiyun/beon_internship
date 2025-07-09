<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'username atau password salah',
                'status_code' => 401
            ], 401);
        }
        $user = User::where("email", $request->email)->first();
        $expirationTime = Carbon::now()->addHours(1);
        $token = $user->createToken('auth_token', ['*'], $expirationTime)->plainTextToken;
        return response()->json([
            'message' => 'Login successful',
            'status_code' => 200,
            'data' => [
                'user' => auth()->user(),
                'token' => $token,
                'expires_at' => $expirationTime->toDateTimeString()
            ]
        ], 200);


    }
    public function logout()
    {
        if(Auth::check()){
            Auth::user()->currentAccessToken()->delete();
            return response()->json([
                'message' => 'Logout successful',
                'status_code' => 200
            ], 200);
        }
        return response()->json([
            'message' => 'Unauthorized',
            'status_code' => 401
        ], 401);
    }
}
