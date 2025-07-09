<?php

namespace App\Http\Controllers;

use App\Http\Resources\ExpenseResource;
use App\Http\Resources\PaymentResource;
use App\Models\DuesType;
use App\Models\Expense;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function getMonthlySummary(Request $request){
        $endYear = $request->input('year', Carbon::now()->year);
        $endMonth = $request->input('month', Carbon::now()->month);
        $endDate = Carbon::create($endYear, $endMonth, 1)->endOfMonth();
        $startDate = $endDate->copy()->subMonths(11)->startOfMonth();

        $data = [];
        $currentDate = $startDate->copy();

        while ($currentDate <= $endDate) {
            $month = $currentDate->month;
            $year = $currentDate->year;
            $monthName = $currentDate->translatedFormat('M');
            $totalIncome = Payment::whereYear('payment_date', $year)
            ->whereMonth('payment_date', $month)
            ->where('payment_status', 'Paid')
            ->sum('amount');
            $totalExpense = Expense::whereYear('expense_date', $year)->whereMonth('expense_date', $month)->sum('amount');
            $data[] = [
                'month_year' => $monthName . '/' . substr($year, -2),
                'month_number' => $month,
                'year_number' => $year,
                'income' => $totalIncome ?? 0,
                'expense' => $totalExpense ?? 0,
                'balance' => ($totalIncome ?? 0) - ($totalExpense ?? 0),
            ];
            $currentDate->addMonth();
        }
        $overallIncome = collect($data)->sum('income');
        $overallExpense = collect($data)->sum('expense');
        $income = Payment::where('payment_status', 'paid')->sum('amount');
        $expense = Expense::sum('amount');
        $overallBalance = $overallIncome - $overallExpense;
        $balance = $income - $expense;
        return response()->json([
            'message' => 'Monthly financial summary retrieved successfully.',
            'status_code' => 200,
            'data' => [
                'period_start' => $startDate->toDateString(),
                'period_end' => $endDate->toDateString(),
                'monthly_data' => $data,
                'periode_income' => $overallIncome,
                'periode_expense' => $overallExpense,
                'periode_balance' => $overallBalance,
                'overall_income' => $income,
                'overall_expense' => $expense,
                'overall_balance' => $balance,
            ]
        ]);
    }
    public function getMonthlyDetail(Request $request){
        $request->validate([
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:1900|max:' . Carbon::now()->year,
        ]);
        $month = $request->month;
        $year = $request->year;
        $incomes = Payment::whereYear('payment_date', $year)
            ->whereMonth('payment_date', $month)
            ->where('payment_status', 'paid')
            ->with(['home', 'ocupant', 'duesType'])
            ->get();
        $expenses = Expense::whereYear('expense_date', $year)
            ->whereMonth('expense_date', $month)
            ->get();

        $totalIncome = $incomes->sum('amount');
        $totalExpense = $expenses->sum('amount');
        $balance = $totalIncome - $totalExpense;
        return response()->json([
            'message' => 'Monthly financial details retrieved successfully.',
            'status_code' => 200,
            'data' => [
                'month' => Carbon::createFromDate($year, $month, 1)->translatedFormat('F Y'),
                'total_income' => $totalIncome,
                'total_expense' => $totalExpense,
                'balance' => $balance,
                'incomes' => PaymentResource::collection($incomes),
                'expenses' => ExpenseResource::collection($expenses),
            ]
        ]);
    }
}
