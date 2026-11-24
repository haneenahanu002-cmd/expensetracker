import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import Expense from "@/app/models/Expense";

// GET all expenses
export async function GET() {
  try {
    await connectDB();

    const expenses = await Expense.find().sort({
      expenseDate: -1,
      createdAt: -1,
    });

    return NextResponse.json(expenses, { status: 200 });
  } catch (error: any) {
    console.error("FETCH EXPENSES ERROR:", error);

    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

// POST new expense
export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const expense = await Expense.create({
      title: body.title,
      description: body.description,
      amount: Number(body.amount),
      category: body.category,
      expenseDate: body.expenseDate,
      paymentMethod: body.paymentMethod,
    });

    return NextResponse.json(
      {
        message: "Expense added successfully",
        expense,
      },
      { status: 201 }
    );
  } catch (error: any) {
     console.error("ADD EXPENSE ERROR:", error);
    return NextResponse.json(
      {
        message: error.message || "Failed to add expense",
      },
      { status: 400 }
    );
  }
}