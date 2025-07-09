<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $query = Expense::query();
        if ($request->has('search') && $request->get('search') != null) {
            $searchTerm = $request->get('search');
            $query->where('expense_type', 'like', '%' . $searchTerm . '%');
        }
        $expenses = $query->paginate(15);
        return response()->json([
            "message" => "Expenses retrieved successfully",
            "status_code" => 200,
            "data" => $expenses
        ], 200);
    }
    public function show($expenseId)
    {
        $expense = Expense::find($expenseId);
        if(!$expense) {
            return response()->json([
                "message" => "Expense not found",
                "status_code" => 404
            ], 404);
        }
        return response()->json([
            "message" => "Expense retrieved successfully",
            "status_code" => 200,
            "data" => $expense
        ], 200);
    }
    public function store(Request $request)
    {
        $request->validate([
            'expense_type' => 'required|string|max:255',
            'amount' => 'required|numeric|min:1',
            'expense_date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        $expense = Expense::create([
            'expense_type' => $request->expense_type,
            'amount' => $request->amount,
            'expense_date' => Carbon::parse($request->expense_date)->format('Y-m-d'),
            'description' => $request->description ?? null,
        ]);

        return response()->json([
            "message" => "Expense created successfully",
            "status_code" => 201,
            "data" => $expense
        ], 201);
    }
    public function update(Request $request, $expenseId)
    {
        $expense = Expense::find($expenseId);
        if(!$expense) {
            return response()->json([
                "message" => "Expense not found",
                "status_code" => 404
            ], 404);
        }
        $request->validate([
            'expense_type' => 'required|string|max:255',
            'amount' => 'required|numeric|min:1',
            'expense_date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        $expense->update([
            'expense_type' => $request->expense_type,
            'amount' => $request->amount,
            'expense_date' => $request->expense_date,
            'description' => $request->description,
        ]);

        return response()->json([
            "message" => "Expense updated successfully",
            "status_code" => 200,
            "data" => $expense
        ], 200);
    }
}
